import { Component, Input, OnInit } from '@angular/core';
import { SessionInfo } from '../../models/session';
import { User } from '../../models/user';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../../models/message';
import { HubConnection } from '@microsoft/signalr';
import { SessionService } from '../../data-access/session.service';
import { UserService } from '../../data-access/user.service';

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

  constructor(private sessionService: SessionService, private userService: UserService) { }

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

  sendMessage(message: Message): void {
    if (this.user) {
      const subscription = this.userService.sendUserMessage(this.session.id, this.user.id, message).subscribe(() => {
        subscription.unsubscribe();
      });
    } else if ('controlId' in this.session) {
      const subscription = this.sessionService.sendMessage({ ...this.session, controlId: <string>this.session.controlId }, 'notify', message).subscribe(() => {
        subscription.unsubscribe();
      });
    }
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
