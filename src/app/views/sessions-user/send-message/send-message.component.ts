import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject, switchMap } from 'rxjs';
import { Session } from 'src/app/models/types';
import { User } from 'src/app/models/user';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.sass']
})
export class SendMessageComponent {

  @Input("session") session!: Session;
  @Input("user") user!: User;

  constructor(private _sessionService: SessionService) {

  }

  messageControl = new FormControl('', [Validators.required]);
  message = new Subject<string>();

  message$ = this.message.pipe(
    switchMap(message => this._sessionService.sendUserMessage(this.session.id, this.user.id, message))
  );

  sendMessage() {
    const message = this.messageControl.value ?? '';
    this.message.next(message);
    this.messageControl.setValue('');
  }
}
