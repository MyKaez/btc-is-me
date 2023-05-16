import { Component, Input } from '@angular/core';
import { SessionInfo } from '../../models/session';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent {
  @Input("session") session!: SessionInfo;
}
