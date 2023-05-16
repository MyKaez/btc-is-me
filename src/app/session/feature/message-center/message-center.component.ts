import { Component, Input } from '@angular/core';
import { SessionInfo } from '../../models/session';
import { UserControl } from '../../models/user';
import { Message } from '../../models/message';
import { SessionService } from '../../data-access/session.service';
import { UserService } from '../../data-access/user.service';

@Component({
  selector: 'app-message-center',
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.scss'],
})
export class MessageCenterComponent {

  @Input("session") session!: SessionInfo;
  @Input("user") user?: UserControl;
  @Input("messages") messages!: Message[];

  constructor(private sessionService: SessionService, private userService: UserService) { }

  sendMessage(message: Message): void {
    if (this.user) {
      const subscription = this.userService.sendMessage(this.session.id, this.user, message).subscribe(() => {
        subscription.unsubscribe();
      });
    } else if ('controlId' in this.session) {
      const sessionControl = { ...this.session, controlId: <string>this.session.controlId };
      const subscription = this.sessionService.sendMessage(sessionControl, message).subscribe(() => {
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
