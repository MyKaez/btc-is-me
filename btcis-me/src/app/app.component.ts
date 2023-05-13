import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Sessions', url: '/session', icon: 'code-working' },
    { title: 'Help...', url: '/folder/inbox', icon: 'mail' }
  ];
  public labels = ['Sessions', 'Users'];
  constructor() { }
}
