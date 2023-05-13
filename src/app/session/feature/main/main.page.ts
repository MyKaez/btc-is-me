import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../data-access/session.service';
import { Subject, catchError, delay, filter, map, merge, of, shareReplay, switchMap, take, tap } from 'rxjs';
import { Session, SessionHostInfo, SessionInfo } from '../../models/session';
import { User } from '../../models/user';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage {

  private static readonly LOCAL_STORAGE = 'sessionHost';

  private session = new Subject<Session>();
  private load = new Subject<boolean>();

  constructor(private sessionService: SessionService, private route: ActivatedRoute) {
  }

  user?: User;

  getSessionById$ = this.route.params.pipe(
    map(p => p['id']),
    filter(sessionId => sessionId !== undefined && sessionId !== null),
    switchMap(p => this.sessionService.getSession(p).pipe(
      catchError(error => {
        if (error.status === 404) {
          return of(undefined);
        } else {
          throw error;
        }
      })
    ))
  );

  storedSession$ = of(localStorage.getItem(MainPage.LOCAL_STORAGE)).pipe(
    filter(session => session !== undefined && session !== null),
    delay(200), // we should delay this, since it's just a fallback!! 
    map(session => <SessionHostInfo>JSON.parse(session!)),
    switchMap(session => this.sessionService.getSession(session.id).pipe(
      map(inner => {
        return { ...session, expirationTime: inner.expirationTime }
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
    map(session => <SessionHostInfo>session),
    switchMap(session => this.sessionService.getSession(session.id).pipe(
      map(inner => {
        return { ...session, users: inner.users };
      })
    )),
    shareReplay(1)
  );

  hubConnection$ = this.currentSession$.pipe(
    map(session => this.sessionService.connect(connection => {
      connection.on(`${session.id}:CreateUser`, user => session.users = [...session.users, user]);
    })),
    shareReplay(1)
  )

  loading$ = this.load.pipe();

  registerSession(sessionName: string): void {
    this.load.next(true);
    const session = { name: sessionName };
    this.session.next(session);
  }

  isSessionHost(session: SessionHostInfo | SessionInfo): boolean {
    return 'controlId' in session;
  }

  setUser(user: User) {
    this.user = user;
  }
}
