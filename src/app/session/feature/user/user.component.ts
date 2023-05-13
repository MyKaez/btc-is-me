import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, shareReplay, switchMap, tap } from 'rxjs';
import { SessionInfo } from '../../models/session';
import { UserService } from '../../data-access/user.service';
import { SuggestionService } from '../../data-access/suggestion.service';
import { Message } from '../../models/message';
import { FormControl, Validators } from '@angular/forms';
import { User } from '../../models/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {

  @Input("session") session!: SessionInfo;
  @Output("userChange") userChange = new EventEmitter<User>();

  private userName = new Subject<string>();
  private loading = new Subject<boolean>();

  constructor(private userService: UserService, private suggestionService: SuggestionService) {
  }

  userNameControl = new FormControl('', [Validators.required, Validators.minLength(5)]);

  user$ = this.userName.pipe(
    switchMap(userName => this.userService.registerUser(this.session.id, userName)),
    shareReplay(1),
    tap(user => this.userChange.emit(user))
  );

  loading$ = this.loading.pipe();

  ngAfterViewInit(): void {
    const subscription = this.suggestionService.suggestUser().subscribe(suggestion => {
      this.userNameControl.setValue(suggestion.name);
      subscription.unsubscribe();
    });
  }

  registerUser(): void {
    this.loading.next(true);
    this.userName.next(this.userNameControl.value ?? '');
  }

  sendMessage(message: Message): void {
    const subscription = this.user$.pipe(switchMap(user =>
      this.userService.sendUserMessage(this.session.id, user.id, message)
    )).subscribe(() => {
      subscription.unsubscribe();
    });
  }
}
