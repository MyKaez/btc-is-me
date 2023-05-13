import { Component, Input, OnInit } from '@angular/core';
import { SessionInfo } from '../../models/session';
import { User } from '../../models/user';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../../models/message';
import { HubConnection } from '@microsoft/signalr';

@Component({
  selector: 'app-message-center',
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.scss'],
})
export class MessageCenterComponent implements OnInit {
  @Input("session") session!: SessionInfo;
  @Input("hubConnection") hubConnection!: HubConnection;
  @Input("user") user?: User;

  private messages = new BehaviorSubject<Message[]>([]);

  constructor() { }

  messages$ = this.messages.pipe();

  ngOnInit() {
    this.hubConnection.on(this.session.id, message => {
      if ('id' in message && 'status' in message) {
        this.messages.next([{ senderId: message.id, text: 'Status updated: ' + message.status }, ...this.messages.value]);
      } else if ('senderId' in message && 'text' in message) {
        this.messages.next([message, ...this.messages.value]);
      } else {
        this.messages.next([{ senderId: '???', text: 'cannot handle: ' + JSON.stringify(message) }, ...this.messages.value]);
      }
    });
  }

  isMe(message: Message): boolean {
    return !this.user && this.session.id === message.senderId || this.user?.id === message.senderId;
  }

  getSender(message: Message) {
    if (this.isMe(message)) {
      return 'Me';
    }

    if (this.session.id === message.senderId) {
      return 'Session Host';
    }
    const user = this.session.users.find(u => u.id === message.senderId);
    if (user) {
      return user.name;
    } else {
      return 'unknown sender id: ' + message.senderId;
    }
  }
}
