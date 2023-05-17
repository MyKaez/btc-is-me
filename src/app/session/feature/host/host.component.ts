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

  private sessionStatus = new BehaviorSubject<{ action?: SessionAction, configuration: any }>({ configuration: this.session?.configuration });
  private button = new BehaviorSubject<boolean>(false);

  constructor(private sessionService: SessionService) {
  }

  get controlSession(): SessionControlInfo {
    return <SessionControlInfo>this.session;
  }

  sessionUpdates$ = combineLatest([this.sessionStatus, this.button]).pipe(
    filter(([_, button]) => button === true),
    switchMap(([input, _]) => this.sessionService.executeAction(this.controlSession, input.action!, input.configuration)),
    map((input) => input.status)
  );

  prepare() {
    const session = this.createUpdate('prepare', { simulationType: 'proofOfWork' });
    this.button.next(true);
    this.sessionStatus.next(session);
  }

  start() {
    const session = this.createUpdate('start');
    this.button.next(true);
    this.sessionStatus.next(session);
  }

  stop() {
    const session = this.createUpdate('stop');
    this.button.next(true);
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
    this.button.next(true);
    this.sessionStatus.next(update);
  }
}