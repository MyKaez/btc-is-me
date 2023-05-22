import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Subject, shareReplay, switchMap, tap } from 'rxjs';
import { SessionInfo } from '../../models/session';
import { UserService } from '../../data-access/user.service';
import { SuggestionService } from '../../data-access/suggestion.service';
import { FormControl, Validators } from '@angular/forms';
import { User, UserControl } from '../../models/user';
import { Block } from '../../models/block';
import { HashListComponent } from '../../ui/hash-list/hash-list.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {

  @Input("session") session!: SessionInfo;
  @Input("user") user?: User;
  @Output("userChange") userChange = new EventEmitter<UserControl>();
  @ViewChild("hashList") hashList?: HashListComponent;;

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
    if (!this.user) {
      return;
    }
    this.user.status = 'ready';
    const config = { hashRate: this.hashRateControl.value ?? 0 };
    const subscription = this.userService.sendUpdate(this.session.id, <UserControl>this.user, config).subscribe(_ => {
      subscription.unsubscribe();
    });
  }

  determine() {
    if (this.hashList) {
      const hashRate = this.hashList.determine();
      this.hashRateControl.setValue(hashRate);
    }
  }

  hashFound(block: any) {
    const subscription = this.userService.sendUpdate(this.session.id, <UserControl>this.user, block).subscribe(_ => {
      subscription.unsubscribe();
    })
  }
}
