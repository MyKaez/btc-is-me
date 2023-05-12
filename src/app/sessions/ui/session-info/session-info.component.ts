import { Component, Input } from '@angular/core';
import { Session } from 'src/app/sessions/models/types';

@Component({
  selector: 'app-session-info',
  templateUrl: './session-info.component.html',
  styleUrls: ['./session-info.component.sass']
})
export class SessionInfoComponent {

  @Input("session") session!: Session;

  get sessionLink(): string {
    const sessionId = this.session.id;
    if (window.location.href.includes(sessionId))
      return window.location.href;
    return window.location.href + '/' + sessionId;
  }
}
