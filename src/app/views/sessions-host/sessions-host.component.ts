import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject, switchMap } from 'rxjs';
import { ControlSession, Session } from 'src/app/session/types';

@Component({
  selector: 'app-sessions-host',
  templateUrl: './sessions-host.component.html',
  styleUrls: ['./sessions-host.component.sass']
})
export class SessionsHostComponent {
  private _baseUrl = 'https://api.btcis.me';
  //private _baseUrl = 'https://localhost:5001';

  @Input("session") session!: Session;

  constructor(private _httpClient: HttpClient) {
  }

  messageControl = new FormControl('', [Validators.required]);
  message = new Subject<{ id: string, controlId: string, action: string, data?: any }>();

  currentMessage$ = this.message.pipe(
    switchMap(message =>
      this._httpClient.post(`${this._baseUrl}/v1/sessions/${message.id}/actions`, message)
    )
  );

  sendMessage(): void {
    const session = <ControlSession>this.session;
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
}
