import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject, switchMap } from 'rxjs';
import { ControlSession, Session } from 'src/app/sessions/models/types';
import { SessionService } from 'src/app/sessions/data-access/session.service';

@Component({
  selector: 'app-sessions-host',
  templateUrl: './session-host.component.html',
  styleUrls: ['./session-host.component.sass']
})
export class SessionsHostComponent {

  @Input("session") session!: Session;

  get controlSession(): ControlSession {
    return <ControlSession>this.session;
  }

  constructor(private _sessionService: SessionService) {
  }

  messageControl = new FormControl('', [Validators.required]);
  message = new Subject<string>();

  currentMessage$ = this.message.pipe(
    switchMap(message => this._sessionService.sendSessionMessage(this.controlSession, message))
  );

  sendMessage(): void {
    const message = this.messageControl.value ?? '';
    this.message.next(message);
    this.messageControl.setValue('');
  }
}
