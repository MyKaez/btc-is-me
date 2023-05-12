import { Component, Input } from '@angular/core';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.sass']
})
export class UserInfoComponent {
  @Input("user") user!: User;
}
