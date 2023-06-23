import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Sessions', url: '/session', icon: 'code-working' },
    { title: 'Donate', url: 'https://nodeless.io/donate/btcis-me', icon: 'cash' },
    { title: 'FixesTh.is', url: 'https://fixesth.is', icon: 'desktop' }
  ];
  public labels = ['Sessions', 'Users'];
  constructor() { }
}
