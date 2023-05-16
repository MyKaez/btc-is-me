import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, shareReplay, switchMap, tap } from 'rxjs';
import { SessionInfo } from '../../models/session';
import { UserService } from '../../data-access/user.service';
import { SuggestionService } from '../../data-access/suggestion.service';
import { FormControl, Validators } from '@angular/forms';
import { User, UserControl } from '../../models/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {

  @Input("session") session!: SessionInfo;
  @Input("user") user?: User;
  @Output("userChange") userChange = new EventEmitter<UserControl>();

  private userName = new Subject<string>();
  private loading = new Subject<boolean>();

  constructor(private userService: UserService, private suggestionService: SuggestionService) {
  }

  userNameControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
  hashRateControl = new FormControl<number>(0);

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

  ready(): void {
    if (this.user) {
      this.user.status = 'ready';
    }
  }
}
