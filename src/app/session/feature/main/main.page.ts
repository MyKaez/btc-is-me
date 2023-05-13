import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../data-access/session.service';
import { BehaviorSubject, Subject, filter, map, merge, shareReplay, switchMap, tap } from 'rxjs';
import { Session, SessionHostInfo, SessionInfo } from '../../models/session';
import { Message } from '../../models/message';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements AfterViewInit {

  private static readonly LOCAL_STORAGE = 'sessionHost';

  private session = new Subject<Session>();
  private messages = new BehaviorSubject<Message[]>([]);
  private load = new Subject<boolean>();

  constructor(private sessionService: SessionService, private route: ActivatedRoute) {
  }

  ngAfterViewInit(): void {
    const session = localStorage.getItem(MainPage.LOCAL_STORAGE);
    if (session) {
      const host = <SessionHostInfo>JSON.parse(session);
      const subscription = this.sessionService.getSession(host.id).subscribe(res => {
        if (res?.id === host.id) {
          this.session.next(host);
        } else {
          localStorage.removeItem(MainPage.LOCAL_STORAGE);
        }
        subscription.unsubscribe();
      });
    }
  }

  messages$ = this.messages.pipe();

  getSessionById$ = this.route.params.pipe(
    map(p => p['id']),
    filter(sessionId => sessionId !== undefined),
    switchMap(p => this.sessionService.getSession(p))
  );

  createSession$ = this.session.pipe(
    filter(session => session !== undefined),
    switchMap(session => this.sessionService.createSession(session))
  );

  currentSession$ = merge(this.getSessionById$, this.createSession$).pipe(
    tap(session => localStorage.setItem(MainPage.LOCAL_STORAGE, JSON.stringify(session))),
    tap(session => this.sessionService.connect(connection => {
      connection.on(session.id, message => this.messages.next([message, ...this.messages.value]));
      connection.on(`${session.id}:CreateUser`, user => session.users = [...session.users, user]);
    })),
    shareReplay(1)
  );

  loading$ = this.load.pipe();

  registerSession(sessionName: string): void {
    this.load.next(true);
    const session = { name: sessionName };
    this.session.next(session);
  }

  isSessionHost(session: SessionHostInfo | SessionInfo): boolean {
    return 'controlId' in session;
  }

  printMessage(message: Message) {
    return JSON.stringify(message);
  }
}
