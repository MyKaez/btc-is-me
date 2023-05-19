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

    con.on(`${session.id}:SessionUpdate`, update => {
      console.log('UpdateSession');
      session.status = update.status;
      session.configuration = update.configuration;
      messageUpdate([{ senderId: update.id, text: `status update:  ${update.status}` }]);
    });

    con.on(`${session.id}:CreateUser`, _ => {
      console.log('CreateUser');
      const subscription = this.userService.getUsers(session.id).subscribe(users => {
        session.users = users;
        subscription.unsubscribe();
      });
    });

    con.on(`${session.id}:DeleteUser`, userId => {
      console.log('DeleteUser');
      const user = session.users.find(user => user.id === userId);
      if (!user) {
        console.log('No user found');
        return;
      }
      session.users.unshift(user);
      if (session.configuration?.simulationType === 'proofOfWork') {
        session.configuration.hashRate -= Number.parseInt(user.configuration.hashRate);
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
          session.configuration.hashRate += Number.parseInt(update.configuration.hashRate);
        }
      } else {
        messageUpdate([{ senderId: '???', text: 'cannot handle UserUpdate: ' + JSON.stringify(update) }]);
      }
    });

    con.on(`${session.id}:UserMessage`, message => {
      console.log('UserMessage');
      if ('senderId' in message && 'text' in message) {
        messageUpdate([message]);
      } else {
        messageUpdate([{ senderId: '???', text: 'cannot handle UserMessage: ' + JSON.stringify(message) }]);
      }
    });
  }
}
