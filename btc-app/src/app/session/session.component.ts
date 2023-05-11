import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Subject, filter, map, switchMap, tap } from 'rxjs';
import { ControlSession } from './types';


@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.sass']
})
export class SessionComponent {
  private baseUrl = 'https://localhost:5001';// http://api.btcis.me

  private _hubConnection: HubConnection | undefined;

  nameControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  messageControl = new FormControl('');
  session = new Subject<{ name: string }>();
  message = new Subject<{ id: string, controlId: string, action: string, data?: any }>();
  messages = new BehaviorSubject<string[]>([]);

  constructor(private _httpClient: HttpClient) { }

  get isConnected(): boolean {
    return this._hubConnection !== undefined;
  }

  currentSession$ = this.session.pipe(
    switchMap(session =>
      this._httpClient.post(`${this.baseUrl}/v1/sessions`, session).pipe(
        map(value => <ControlSession>value)
      )
    ),
    tap(session => this._hubConnection = this.connect(session.id))
  );

  currentMessage$ = this.message.pipe(
    switchMap(message =>
      this._httpClient.post(`${this.baseUrl}/v1/sessions/${message.id}/actions`, message)
    )
  );

  registerSession(): void {
    const session = { name: this.nameControl.value! };
    this.session.next(session);
  }

  shareSession(sessionId: string) {
    console.log(sessionId);
  }

  public sendMessage(session: ControlSession): void {
    const message = {
      id: session.id,
      controlId: session.controlId,
      action: 'notify',
      data: {
        message: this.messageControl.value,
        origin: 'kenny',
        date: new Date()
      }
    };
    this.message.next(message);
  }

  private connect(sessionId: string): HubConnection {
    const connection = new HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/v1/sessions`)
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
