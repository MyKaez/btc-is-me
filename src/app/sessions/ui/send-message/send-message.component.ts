import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SessionInfo } from "../../models/session";
import { User } from 'src/app/sessions/models/user';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.sass']
})
export class SendMessageComponent {

  @Input("session") session!: SessionInfo;
  @Input("user") user!: User;

  @Output("messageSend") messageSend = new EventEmitter<string>();

  messageControl = new FormControl('', [Validators.required]);

  sendMessage() {
    const message = this.messageControl.value ?? '';
    this.messageSend.next(message);
    this.messageControl.setValue('');
  }
}
