import { Component } from '@angular/core';
import { BehaviorSubject, Subject, filter, map, merge, switchMap, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../data-access/session.service';
import { SessionHostInfo, Session, SessionInfo } from '../../models/session';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.sass']
})
export class SessionComponent {

  constructor(private _sessionService: SessionService, private _route: ActivatedRoute) {
  }

  session = new Subject<Session>();
  messages = new BehaviorSubject<string[]>([]);

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
    tap(session => this._sessionService.connect(session.id, message => this.messages.next([message, ...this.messages.value])))
  );

  registerSession(sessionName: string): void {
    const session = { name: sessionName };
    this.session.next(session);
  }

  isSessionHost(session: SessionHostInfo | SessionInfo): boolean {
    return 'controlId' in session;
  }
}
