import { Component } from '@angular/core';
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
export class MainPage {

  private session = new Subject<Session>();
  private messages = new BehaviorSubject<Message[]>([]);
  private load = new Subject<boolean>();

  constructor(private sessionService: SessionService, private route: ActivatedRoute) {
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

  currentSession$ = merge(this.createSession$, this.getSessionById$).pipe(
    filter(session => session !== undefined),
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
