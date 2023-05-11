import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, switchMap } from 'rxjs';
import { Session } from 'src/app/models/types';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-sessions-user',
  templateUrl: './sessions-user.component.html',
  styleUrls: ['./sessions-user.component.sass']
})
export class SessionsUserComponent {

  @Input("session") session!: Session;

  constructor(private _sessionService: SessionService) {
  }

  userNameControl = new FormControl('');
  userName = new Subject<string>();

  user$ = this.userName.pipe(
    switchMap(userName => this._sessionService.registerUser(this.session.id, userName))
  );

  registerUser(): void {
    this.userName.next(this.userNameControl.value ?? '');
  }
}
