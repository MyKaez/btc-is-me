import { Component } from '@angular/core';
import { BehaviorSubject, Subject, combineLatest, filter, map, merge, shareReplay, switchMap, take, tap, zip } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../data-access/session.service';
import { SessionHostInfo, Session, SessionInfo } from '../../models/session';
import { Message } from '../../models/message';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.sass']
})
export class SessionComponent {

  constructor(private _sessionService: SessionService, private _route: ActivatedRoute) {
  }

  private session = new Subject<Session>();
  private messages = new BehaviorSubject<Message[]>([]);
  private load = new Subject<boolean>();

  messages$ = this.messages.pipe();

  getSessionById$ = this._route.params.pipe(
    map(p => p['sessionId']),
    filter(sessionId => sessionId !== undefined),
    switchMap(p => this._sessionService.getSession(p))
  );

  createSession$ = this.session.pipe(
    filter(session => session !== undefined),
    switchMap(session => this._sessionService.createSession(session))
  );

  currentSession$ = merge(this.createSession$, this.getSessionById$).pipe(
    filter(session => session !== undefined),
    tap(session => this._sessionService.connect(session.id, message => this.messages.next([message, ...this.messages.value]))),
    shareReplay(1)
  );

  loading$ = this.load.pipe();

  registerSession(sessionName: string): void {
    this.load.next(true);
    const session = { name: sessionName };
    this.session.next(session);
  }

  isSessionHost(session: SessionHostInfo | SessionInfo): boolean {
    return session as SessionHostInfo !== undefined;
  }

  printMessage(message: Message) {
    return JSON.stringify(message);
  }
}
