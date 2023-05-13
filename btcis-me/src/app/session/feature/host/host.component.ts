import { Component, Input, OnInit } from '@angular/core';
import { SessionHostInfo, SessionInfo } from '../../models/session';
import { Subject, switchMap } from 'rxjs';
import { Message } from '../../models/message';
import { SessionService } from '../../data-access/session.service';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss'],
})
export class HostComponent {

  @Input("session") session!: SessionInfo;

  private message = new Subject<Message>();
  private sessionStatus = new Subject<'start' | 'stop'>();

  constructor(private sessionService: SessionService) {
  }

  get controlSession(): SessionHostInfo {
    return <SessionHostInfo>this.session;
  }

  sessionStatus$ = this.sessionStatus.pipe(
    switchMap(status => this.sessionService.sendMessage(this.controlSession, status))
  );

  sendMessage(message: Message): void {
    const subscription = this.sessionService.sendMessage(this.controlSession, 'notify', message).subscribe(() => {
      subscription.unsubscribe();
    });
  }

  start() {
    this.sessionStatus.next('start');
  }

  stop() {
    this.sessionStatus.next('stop');
  }
}