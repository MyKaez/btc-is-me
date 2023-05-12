import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { SuggestionsService } from '../../data-access/suggestions.service';

@Component({
  selector: 'app-session-creator',
  templateUrl: './session-creator.component.html',
  styleUrls: ['./session-creator.component.sass']
})
export class SessionCreatorComponent implements AfterViewInit {

  @Output() nameChange = new EventEmitter<string>();

  constructor(private _suggestionService: SuggestionsService) {
  }

  nameControl = new FormControl('', [Validators.required, Validators.minLength(5)]);

  nameControl$ = this.nameControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged()
  );

  ngAfterViewInit(): void {
    const subscription = this._suggestionService.suggestSession().subscribe(suggestion => {
      this.nameControl.setValue(suggestion.name);
      subscription.unsubscribe();
    });
  }
}
