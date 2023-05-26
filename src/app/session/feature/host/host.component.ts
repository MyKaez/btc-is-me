import { Component, Input, } from '@angular/core';
import { SessionControlInfo, SessionInfo, SessionAction } from '../../models/session';
import { BehaviorSubject, combineLatest, filter, map, switchMap, withLatestFrom } from 'rxjs';
import { SessionService } from '../../data-access/session.service';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss'],
})
export class HostComponent {

  @Input("session") session!: SessionInfo;

  constructor(private sessionService: SessionService) {
  }

  get controlSession(): SessionControlInfo {
    return <SessionControlInfo>this.session;
  }

  prepare() {
    this.createUpdate('prepare', { simulationType: 'proofOfWork' });
  }

  start() {
    this.createUpdate('start');
  }

  stop() {
    const session = this.createUpdate('stop');
  }

  clear() {
    const update = this.createUpdate('reset');
  }

  createUpdate(action: SessionAction, config?: any): void {
    const update = {
      ...this.session, action: action,
      configuration: {
        ...(this.session.configuration ?? {}),
        ...this.session.configuration,
        ...(config ?? {})
      }
    };
    console.log(JSON.stringify(update));
    const subscription = this.sessionService.executeAction(this.controlSession, action, config).subscribe(_ => {
      subscription.unsubscribe();
    });
  }
}