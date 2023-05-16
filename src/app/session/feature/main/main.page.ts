import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../data-access/session.service';
import { Subject, catchError, delay, filter, map, merge, of, shareReplay, switchMap, take, tap } from 'rxjs';
import { Session, SessionControlInfo, SessionInfo } from '../../models/session';
import { UserControl } from '../../models/user';
import { Message } from '../../models/message';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage {

  private static readonly LOCAL_STORAGE = 'sessionHost';

  private session = new Subject<Session>();
  private load = new Subject<boolean>();

  constructor(private sessionService: SessionService, private route: ActivatedRoute, private router: Router) {
  }

  user?: UserControl;
  type: 'session-info' | 'message-center' | 'user-action' = 'session-info';
  messages: Message[] = [];

  getSessionById$ = this.route.params.pipe(
    map(p => p['id']),
    filter(sessionId => sessionId !== undefined && sessionId !== null),
    switchMap(p => this.sessionService.getSession(p).pipe(
      catchError(error => {
        if (error.status === 404) {
          this.router.navigate(['/session']);
          return of(undefined);
        } else {
          throw error;
        }
      })
    )),
    tap(_ => this.type = 'user-action')
  );

  storedSession$ = of(localStorage.getItem(MainPage.LOCAL_STORAGE)).pipe(
    filter(session => session !== undefined && session !== null),
    delay(200), // we should delay this, since it's just a fallback!! 
    map(session => <SessionControlInfo>JSON.parse(session!)),
    switchMap(session => this.sessionService.getSession(session.id).pipe(
      map(inner => {
        return { ...session, expirationTime: inner.expirationTime, status: inner.status }
      }),
      catchError(error => {
        if (error.status === 404) {
          localStorage.removeItem(MainPage.LOCAL_STORAGE);
          return of(undefined);
        } else {
          throw error;
        }
      })
    ))
  );

  createSession$ = this.session.pipe(
    filter(session => session !== undefined && session !== null),
    switchMap(session => this.sessionService.createSession(session)),
    tap(session => localStorage.setItem(MainPage.LOCAL_STORAGE, JSON.stringify({ ...session, users: [] }))),
  );

  currentSession$ = merge(this.getSessionById$, this.createSession$, this.storedSession$).pipe(
    filter(session => session !== undefined),
    take(1),
    map(session => <SessionControlInfo>session),
    switchMap(session => this.sessionService.getSession(session.id).pipe(
      map(inner => {
        return { ...session, users: inner.users };
      })
    )),
    shareReplay(1)
  );

  hubConnection$ = this.currentSession$.pipe(
    map(session => this.sessionService.connect(con => {
      con.on(`${session.id}:CreateSession`, session => console.log('Created session: ' + session.id));
      con.on(`${session.id}:CreateUser`, user => session.users = [...session.users, user]);
      con.on(`${session.id}:DeleteUser`, userId => session.users = session.users.filter(user => user.id !== userId));
      con.on(`${session.id}:SessionUpdate`, update => {
        session.status = update.status;
        session.configuration = update.data
        this.messages = [{ senderId: update.id, text: 'Status updated: ' + update.status }, ...this.messages];
      });
      con.on(`${session.id}:UserMessage`, message => {
        if ('senderId' in message && 'text' in message) {
          this.messages = [message, ...this.messages];
        } else {
          this.messages = [{ senderId: '???', text: 'cannot handle: ' + JSON.stringify(message) }, ...this.messages];
        }
      });
    }, con => con.invoke('RegisterSession', session.id))),
    shareReplay(1)
  )

  loading$ = this.load.pipe();

  logOut() {
    localStorage.removeItem(MainPage.LOCAL_STORAGE);
    this.router.navigate(['/log-out/session'])
  }

  registerSession(sessionName: string): void {
    this.load.next(true);
    const session = { name: sessionName };
    this.session.next(session);
  }

  isSessionHost(session: SessionControlInfo | SessionInfo): boolean {
    return 'controlId' in session;
  }

  setUser(user: UserControl) {
    this.user = user;
    const subscription = this.hubConnection$.subscribe(con => {
      con.invoke('RegisterUser', user.id);
      subscription.unsubscribe();
    });
  }
}
