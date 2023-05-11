import { Component } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Subject, filter, map, merge, switchMap, tap } from 'rxjs';
import { ControlSession, Session } from '../models/types';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../services/session.service';
import { CreateSession } from '../models/create-session';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.sass']
})
export class SessionComponent {
  private _hubConnection?: HubConnection;

  constructor(private _sessionService: SessionService, private _route: ActivatedRoute) {
  }

  session = new Subject<CreateSession>();
  messages = new BehaviorSubject<string[]>([]);

  get isConnected(): boolean {
    return this._hubConnection !== undefined;
  }

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
    tap(session => this._hubConnection = this.connect(session.id))
  );

  registerSession(sessionName: string): void {
    console.log(sessionName)
    console.log(this.session)
    const session = { name: sessionName };
    this.session.next(session);
  }

  isSessionHost(session: ControlSession | Session): boolean {
    return 'controlId' in session;
  }

  private connect(sessionId: string): HubConnection {
    const connection = new HubConnectionBuilder()
      .withUrl(`${this._sessionService._baseUrl}/v1/sessions`)
      .build();

    connection.on(sessionId, message => {
      this.messages.next([message, ...this.messages.value])
    });

    connection.start()
      .then(() => console.log('connection started'))
      .catch((err) => console.log('error while establishing signalr connection: ' + err));

    return connection;
  }
}
