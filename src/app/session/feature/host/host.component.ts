import { Component, Input, OnInit } from '@angular/core';
import { SessionControlInfo, SessionInfo } from '../../models/session';
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

  private sessionStatus = new Subject<'prepare' | 'start' | 'stop'>();

  constructor(private sessionService: SessionService) {
  }

  get controlSession(): SessionControlInfo {
    return <SessionControlInfo>this.session;
  }

  sessionStatus$ = this.sessionStatus.pipe(
    switchMap(status => this.sessionService.sendMessage(this.controlSession, status))
  );

  prepare() {
    this.sessionStatus.next('prepare');
  }

  start() {
    this.sessionStatus.next('start');
  }

  stop() {
    this.sessionStatus.next('stop');
  }

  clear() {
    throw new Error('Method not implemented.');
  }
}