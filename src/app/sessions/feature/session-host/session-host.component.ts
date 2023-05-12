import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject, switchMap } from 'rxjs';
import { SessionHostInfo, SessionInfo } from "../../models/session";
import { SessionService } from 'src/app/sessions/data-access/session.service';
import { Message } from '../../models/message';

@Component({
  selector: 'app-sessions-host',
  templateUrl: './session-host.component.html',
  styleUrls: ['./session-host.component.sass']
})
export class SessionsHostComponent {

  @Input("session") session!: SessionInfo;

  private message = new Subject<Message>();

  get controlSession(): SessionHostInfo {
    return <SessionHostInfo>this.session;
  }

  constructor(private _sessionService: SessionService) {
  }

  message$ = this.message.pipe(
    switchMap(message => this._sessionService.sendSessionMessage(this.controlSession, message))
  );

  sendMessage(message: Message): void {
    this.message.next(message);
  }
}
