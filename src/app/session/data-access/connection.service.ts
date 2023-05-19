import { Injectable } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import { SessionControlInfo } from '../models/session';
import { UserService } from './user.service';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(private userService: UserService) { }

  connect(con: HubConnection, session: SessionControlInfo, messageUpdate: (messages: Message[]) => void) {
    con.on(`${session.id}:CreateSession`, session => console.log('Created session: ' + session.id));
    con.on(`${session.id}:CreateUser`, user => {
      console.log('CreateUser');
      const subscription = this.userService.getUsers(session.id).subscribe(users => {
        session.users = users;
        subscription.unsubscribe();
      });
    });
    con.on(`${session.id}:DeleteUser`, userId => {
      console.log('DeleteUser');
      session.users = session.users.filter(user => user.id !== userId)
    });
    con.on(`${session.id}:SessionUpdate`, update => {
      console.log('UpdateSession');
      session.status = update.status;
      session.configuration = update.configuration;
      messageUpdate([{ senderId: update.id, text: `status update:  ${update.status}` }]);
    });
    con.on(`${session.id}:UserMessage`, message => {
      console.log('UserMessage');
      if ('senderId' in message && 'text' in message) {
        messageUpdate([message]);
      } else {
        messageUpdate([{ senderId: '???', text: 'cannot handle UserMessage: ' + JSON.stringify(message) }]);
      }
    });
    con.on(`${session.id}:UserUpdate`, update => {
      console.log('UserUpdate');
      const user = session.users.find(u => u.id == update.id);
      if (user) {
        user.status = update.status;
        user.configuration = update.configuration;
        messageUpdate([{ senderId: user.id, text: `user update: ${user.status}` }]);
        if (session.configuration?.simulationType === 'proofOfWork') {
          if (!session.configuration.hashRate) {
            session.configuration.hashRate = 0;
          }
          console.log(JSON.stringify(session.configuration))
          session.configuration.hashRate += update.configuration.hashRate;
        }
      } else {
        messageUpdate([{ senderId: '???', text: 'cannot handle UserUpdate: ' + JSON.stringify(update) }]);
      }
    })
  }
}
