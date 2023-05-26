import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SessionControlInfo, SessionInfo } from '../../models/session';
import { FormControl } from '@angular/forms';
import { Observable, Unsubscribable, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { SessionService } from '../../data-access/session.service';
import { Session } from 'inspector';

@Component({
  selector: 'app-proof-of-work',
  templateUrl: './proof-of-work.component.html',
  styleUrls: ['./proof-of-work.component.scss'],
})
export class ProofOfWorkComponent implements OnInit, OnDestroy {

  @Input("session") session!: SessionInfo;

  private subscriptions: Unsubscribable[] = [];

  constructor(private sessionService: SessionService) { }

  get readonly(): boolean {
    return this.session.status !== 'preparing';
  }

  secondsUntilBlock = new FormControl<number>(0);
  secondsUntilBlock$ = this.secondsUntilBlock.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(value => {
      const config = this.session.configuration!;
      config.secondsUntilBlock = Number.parseInt(value?.toString() ?? '');
      const subscription = this.sessionService.update(<SessionControlInfo>this.session!, config).subscribe(_ => {
        subscription.unsubscribe();
      })
    })
  );

  ngOnInit() {
    this.secondsUntilBlock.setValue(this.session.configuration!.secondsUntilBlock);

    this.subscriptions.push(this.secondsUntilBlock$.subscribe());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
