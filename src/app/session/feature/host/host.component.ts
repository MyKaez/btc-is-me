import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild, } from '@angular/core';
import { SessionControlInfo, SessionInfo, SessionAction, SessionStatus } from '../../models/session';
import { BehaviorSubject, combineLatest, filter, map, switchMap, withLatestFrom } from 'rxjs';
import { SessionService } from '../../data-access/session.service';
import { IonButton } from '@ionic/angular';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss'],
})
export class HostComponent implements AfterViewInit {

  @Input("session") session!: SessionInfo;
  @ViewChild("prepareButton") prepareButton!: IonButton;
  @ViewChild("startButton") startButton!: IonButton;
  @ViewChild("stopButton") stopButton!: IonButton;
  @ViewChild("clearButton") clearButton !: IonButton;

  private context: { button: IonButton, action: SessionAction, status: SessionStatus }[] = [];

  constructor(private sessionService: SessionService) {
  }

  ngAfterViewInit(): void {
    this.context.push({ button: this.prepareButton, action: 'prepare', status: 'notStarted' });
    this.context.push({ button: this.startButton, action: 'start', status: 'preparing' });
    this.context.push({ button: this.stopButton, action: 'stop', status: 'started' });
    this.context.push({ button: this.clearButton, action: 'reset', status: 'stopped' });

    this.context.forEach(button => {
      if (button.status === this.session.status) {
        button.button.color = 'primary';
      } else {
        button.button.color = 'secondary';
        button.button.disabled = true;
      }
    });
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
    this.createUpdate('stop');
  }

  clear() {
    this.createUpdate('reset');
  }

  createUpdate(action: SessionAction, config?: any): void {
    const configuration = {
      ...(this.session.configuration ?? {}),
      ...this.session.configuration,
      ...(config ?? {})
    };
    console.log(JSON.stringify(configuration));
    const subscription = this.sessionService.executeAction(this.controlSession, action, configuration).subscribe(_ => {
      const currentButtonIndex = this.context.findIndex(b => b.action === action)!;
      const currentButton = this.context[currentButtonIndex];
      currentButton.button.disabled = true;
      currentButton.button.color = 'secondary';
      const nextButton = this.context.length - 1 == currentButtonIndex
        ? this.context[0].button : this.context[currentButtonIndex + 1].button;
      nextButton.disabled = false;
      nextButton.color = 'primary';
      subscription.unsubscribe();
    });
  }
}