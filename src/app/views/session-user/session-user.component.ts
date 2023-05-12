import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject, switchMap } from 'rxjs';
import { Session } from 'src/app/models/types';
import { SessionService } from 'src/app/sessions/services/session.service';

@Component({
  selector: 'app-sessions-user',
  templateUrl: './session-user.component.html',
  styleUrls: ['./session-user.component.sass']
})
export class SessionUserComponent {

  @Input("session") session!: Session;

  constructor(private _sessionService: SessionService) {
  }

  userNameControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  userName = new Subject<string>();

  user$ = this.userName.pipe(
    switchMap(userName => this._sessionService.registerUser(this.session.id, userName))
  );

  registerUser(): void {
    this.userName.next(this.userNameControl.value ?? '');
  }
}
