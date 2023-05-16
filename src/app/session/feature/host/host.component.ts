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

  private sessionStatus = new Subject<{ status: 'prepare' | 'start' | 'stop', data: any }>();

  constructor(private sessionService: SessionService) {
  }

  get controlSession(): SessionControlInfo {
    return <SessionControlInfo>this.session;
  }

  sessionStatus$ = this.sessionStatus.pipe(
    switchMap(input => this.sessionService.executeAction(this.controlSession, input.status, input.data))
  );

  prepare() {
    this.sessionStatus.next({
      status: 'prepare',
      data: {}
    });
  }

  start() {
    this.sessionStatus.next({
      status: 'start',
      data: {}
    });
  }

  stop() {
    this.sessionStatus.next({
      status: 'stop',
      data: {}
    });
  }

  clear() {
    throw new Error('Method not implemented.');
  }
}