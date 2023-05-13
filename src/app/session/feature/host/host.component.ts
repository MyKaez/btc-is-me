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

  private sessionStatus = new Subject<'start' | 'stop'>();

  constructor(private sessionService: SessionService) {
  }

  get controlSession(): SessionHostInfo {
    return <SessionHostInfo>this.session;
  }

  sessionStatus$ = this.sessionStatus.pipe(
    switchMap(status => this.sessionService.sendMessage(this.controlSession, status))
  );

  start() {
    this.sessionStatus.next('start');
  }

  stop() {
    this.sessionStatus.next('stop');
  }
}