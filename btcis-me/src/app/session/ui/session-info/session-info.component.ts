import { Component, Input, OnInit } from '@angular/core';
import { SessionInfo } from '../../models/session';

@Component({
  selector: 'app-session-info',
  templateUrl: './session-info.component.html',
  styleUrls: ['./session-info.component.scss'],
})
export class SessionInfoComponent {

  @Input("session") session!: SessionInfo;

  get sessionLink(): string {
    const sessionId = this.session.id;
    if (window.location.href.includes(sessionId))
      return window.location.href;
    return window.location.href + '/' + sessionId;
  }

}
