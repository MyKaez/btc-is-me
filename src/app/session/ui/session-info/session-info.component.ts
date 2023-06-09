import { Component, Input } from '@angular/core';
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

  openLink(): void {
    window.open(this.sessionLink, '_blank');
  }

  copyLink(): void {
    const listener = (e: ClipboardEvent) => {
      e.clipboardData!.setData('text/plain', this.sessionLink);
      e.preventDefault();
      document.removeEventListener('copy', listener);
    };
    document.addEventListener('copy', listener);
    document.execCommand('copy');
  }
}
