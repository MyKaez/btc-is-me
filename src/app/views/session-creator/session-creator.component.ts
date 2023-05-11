import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';

@Component({
  selector: 'app-session-creator',
  templateUrl: './session-creator.component.html',
  styleUrls: ['./session-creator.component.sass']
})
export class SessionCreatorComponent {

  @Output() nameChange = new EventEmitter<string>();

  nameControl = new FormControl('', [Validators.required, Validators.minLength(5)]);

  $nameControl = this.nameControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged()
  );

}
