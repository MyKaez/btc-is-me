import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject, combineLatest, shareReplay, switchMap, tap } from 'rxjs';
import { SessionInfo } from "../../models/session";
import { SessionService } from 'src/app/sessions/data-access/session.service';
import { Message } from '../../models/message';

@Component({
  selector: 'app-sessions-user',
  templateUrl: './session-user.component.html',
  styleUrls: ['./session-user.component.sass']
})
export class SessionUserComponent {

  @Input("session") session!: SessionInfo;

  constructor(private _sessionService: SessionService) {
  }

  private userName = new Subject<string>();
  private message = new Subject<Message>();

  userNameControl = new FormControl('', [Validators.required, Validators.minLength(5)]);

  user$ = this.userName.pipe(
    switchMap(userName => this._sessionService.registerUser(this.session.id, userName)),
    shareReplay(1)
  );

  message$ = combineLatest([this.user$, this.message]).pipe(
    switchMap(([user, message]) => this._sessionService.sendUserMessage(this.session.id, user.id, message)),
  );

  registerUser(): void {
    this.userName.next(this.userNameControl.value ?? '');
  }

  sendMessage(message: Message) {
    this.message.next(message);
  }
}
