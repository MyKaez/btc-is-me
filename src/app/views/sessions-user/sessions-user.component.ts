import { Component, Input } from '@angular/core';
import { Session } from 'src/app/models/types';

@Component({
  selector: 'app-sessions-user',
  templateUrl: './sessions-user.component.html',
  styleUrls: ['./sessions-user.component.sass']
})
export class SessionsUserComponent {
  @Input("session") session!: Session;


}
