import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Subject, filter, map, merge, switchMap, tap } from 'rxjs';
import { ControlSession, Session } from './types';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.sass']
})
export class SessionComponent {
  private _baseUrl = 'https://api.btcis.me';
  //private _baseUrl = 'https://localhost:5001';
  private _hubConnection?: HubConnection;

  constructor(private _httpClient: HttpClient, private _route: ActivatedRoute) {
  }

  nameControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  messageControl = new FormControl('');
  session = new Subject<{ name: string }>();
  message = new Subject<{ id: string, controlId: string, action: string, data?: any }>();
  messages = new BehaviorSubject<string[]>([]);

  get isConnected(): boolean {
    return this._hubConnection !== undefined;
  }

  getSessionById$ = this._route.params.pipe(
    map(p => p['sessionId']),
    filter(sessionId => sessionId !== undefined),
    switchMap(p =>
      this._httpClient.get(`${this._baseUrl}/v1/sessions/${p}`).pipe(
        map(value => <Session>value)
      )
    )
  );

  createSession$ = this.session.pipe(
    filter(session => session !== undefined),
    switchMap(session =>
      this._httpClient.post(`${this._baseUrl}/v1/sessions`, session).pipe(
        map(value => <ControlSession>value)
      )
    )
  );

  currentSession$ = merge(this.createSession$, this.getSessionById$).pipe(
    filter(session => session !== undefined),
    tap(session => this._hubConnection = this.connect(session.id))
  );

  currentMessage$ = this.message.pipe(
    switchMap(message =>
      this._httpClient.post(`${this._baseUrl}/v1/sessions/${message.id}/actions`, message)
    )
  );

  registerSession(): void {
    const session = { name: this.nameControl.value! };
    this.session.next(session);
  }

  sessionLink(sessionId: string): string {
    if (window.location.href.includes(sessionId))
      return window.location.href;
    return window.location.href + '/' + sessionId;
  }

  sendMessage(session: ControlSession | Session): void {
    if (!this.isSessionHost(session))
      return;

    const message = {
      id: session.id,
      controlId: (<ControlSession>session).controlId,
      action: 'notify',
      data: {
        message: this.messageControl.value,
        origin: 'kenny',
        date: new Date()
      }
    };
    this.message.next(message);
  }

  isSessionHost(session: ControlSession | Session): boolean {
    return 'controlId' in session;
  }

  private connect(sessionId: string): HubConnection {
    const connection = new HubConnectionBuilder()
      .withUrl(`${this._baseUrl}/v1/sessions`)
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
