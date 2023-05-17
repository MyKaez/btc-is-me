import { Component, Input, } from '@angular/core';
import { SessionControlInfo, SessionInfo, SessionAction } from '../../models/session';
import { BehaviorSubject, switchMap } from 'rxjs';
import { SessionService } from '../../data-access/session.service';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss'],
})
export class HostComponent {

  @Input("session") session!: SessionInfo;

  private sessionStatus = new BehaviorSubject<{ action?: SessionAction, configuration: any }>({ configuration: {} });

  constructor(private sessionService: SessionService) {
  }

  get controlSession(): SessionControlInfo {
    return <SessionControlInfo>this.session;
  }

  sessionUpdates$ = this.sessionStatus.pipe(
    switchMap(input => this.sessionService.executeAction(this.controlSession, input.action!, input.configuration))
  );

  prepare() {
    const session = this.createSession('prepare', { simulationType: 'proofOfWork' });
    this.sessionStatus.next(session);
  }

  start() {
    const session = this.createSession('start');
    this.sessionStatus.next(session);
  }

  stop() {
    const session = this.createSession('stop');
    this.sessionStatus.next(session);
  }

  clear() {
    const session = this.createSession('reset');
    this.sessionStatus.next(session);
  }

  createSession(action: SessionAction, config?: any) {
    return {
      ...this.sessionStatus.value, action: action, configuration: {
        ...this.sessionStatus.value.configuration, ...(config ?? {})
      }
    };
  }
}