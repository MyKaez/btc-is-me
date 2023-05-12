import { Component, Input } from '@angular/core';
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
  private sessionStatus = new Subject<'start' | 'stop'>();

  get controlSession(): SessionHostInfo {
    return <SessionHostInfo>this.session;
  }

  constructor(private _sessionService: SessionService) {
  }

  message$ = this.message.pipe(
    switchMap(message => this._sessionService.sendMessage(this.controlSession, 'notify', message))
  );

  sessionStatus$ = this.sessionStatus.pipe(
    switchMap(status => this._sessionService.sendMessage(this.controlSession, status))
  );

  sendMessage(message: Message): void {
    this.message.next(message);
  }

  start() {
    this.sessionStatus.next('start');
  }

  stop() {
    this.sessionStatus.next('stop');
  }
}
