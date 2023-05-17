import { Component, Input, } from '@angular/core';
import { SessionControlInfo, SessionInfo, SessionAction } from '../../models/session';
import { BehaviorSubject, filter, shareReplay, switchMap, tap } from 'rxjs';
import { SessionService } from '../../data-access/session.service';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss'],
})
export class HostComponent {

  @Input("session") session!: SessionInfo;

  private sessionStatus = new BehaviorSubject<{ action?: SessionAction, configuration: any }>({ configuration: this.session?.configuration });

  constructor(private sessionService: SessionService) {
  }

  get controlSession(): SessionControlInfo {
    return <SessionControlInfo>this.session;
  }

  sessionUpdates$ = this.sessionStatus.pipe(
    // if status is "notStarted", we will automatically update the action to "prepare" if we do not filter here!
    filter(_ => this.session.status !== 'notStarted'),
    switchMap(input => this.sessionService.executeAction(this.controlSession, input.action!, input.configuration))
  );

  prepare() {
    const session = this.createUpdate('prepare', { simulationType: 'proofOfWork' });
    this.sessionStatus.next(session);
  }

  start() {
    const session = this.createUpdate('start');
    this.sessionStatus.next(session);
  }

  stop() {
    const session = this.createUpdate('stop');
    this.sessionStatus.next(session);
  }

  createUpdate(action: SessionAction, config?: any) {
    const update = {
      ...this.sessionStatus.value, action: action, configuration: {
        ...this.sessionStatus.value.configuration, ...(config ?? {})
      }
    };
    return update;
  }

  clear() {
    const update = { action: <SessionAction>'reset', configuration: {} };
    this.sessionStatus.next(update);
  }
}