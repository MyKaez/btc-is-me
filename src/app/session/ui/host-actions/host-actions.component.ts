import { AfterViewInit, Component, Input, ViewChild, } from '@angular/core';
import { SessionControlInfo, SessionAction, SessionStatus } from '../../models/session';
import { SessionService } from '../../data-access/session.service';
import { IonButton } from '@ionic/angular';
import { ViewModel } from '../../models/view-model';

@Component({
  selector: 'app-host-actions',
  templateUrl: './host-actions.component.html',
  styleUrls: ['./host-actions.component.scss'],
})
export class HostActionsComponent implements AfterViewInit {

  @Input("vm") vm!: ViewModel;

  @ViewChild("prepareButton") prepareButton!: IonButton;
  @ViewChild("startButton") startButton!: IonButton;
  @ViewChild("stopButton") stopButton!: IonButton;
  @ViewChild("clearButton") clearButton !: IonButton;

  private context: { button: IonButton, action: SessionAction, status: SessionStatus }[] = [];

  constructor(private sessionService: SessionService) {
  }

  get controlSession(): SessionControlInfo {
    return <SessionControlInfo>this.vm.session;
  }

  ngAfterViewInit(): void {
    this.vm.userUpdates.push(() => this.onUserUpdate());
    this.context.push({ button: this.prepareButton, action: 'prepare', status: 'notStarted' });
    this.context.push({ button: this.startButton, action: 'start', status: 'preparing' });
    this.context.push({ button: this.stopButton, action: 'stop', status: 'started' });
    this.context.push({ button: this.clearButton, action: 'reset', status: 'stopped' });
    this.context.forEach(button => {
      if (button.status === this.controlSession.status) {
        button.button.color = 'primary';
      } else {
        button.button.color = 'secondary';
        button.button.disabled = true;
      }
    });
  }

  onUserUpdate() {
    console.log('host-action')
    if (this.controlSession.status === 'preparing') {
      const users = this.controlSession.users.filter(u => u.status === 'ready');
      const currentButton = this.context.find(b => b.action === 'start')!;
      currentButton.button.disabled = users.length === 0;
    } else if (this.controlSession.status === 'started') {
      if (this.controlSession.users.find(u => u.status === 'done')) {
        this.updateButtons('stop');
      }
    }
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
      ...(this.controlSession.configuration ?? {}),
      ...this.controlSession.configuration,
      ...(config ?? {})
    };
    console.log(JSON.stringify(configuration));
    const subscription = this.sessionService.executeAction(this.controlSession, action, configuration).subscribe(_ => {
      this.updateButtons(action);
      subscription.unsubscribe();
    });
  }

  updateButtons(action: SessionAction) {
    const currentButtonIndex = this.context.findIndex(b => b.action === action)!;
    const currentButton = this.context[currentButtonIndex];
    currentButton.button.disabled = true;
    currentButton.button.color = 'secondary';
    const nextButton = this.context.length - 1 == currentButtonIndex
      ? this.context[0].button : this.context[currentButtonIndex + 1].button;
    nextButton.disabled = false;
    nextButton.color = 'primary';
  }
}