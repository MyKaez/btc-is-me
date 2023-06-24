import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.scss'],
})
export class LogOutComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.route.params.subscribe(params => {
        const page = params['page'];
        const url = window.location.href.replace('/log-out', '/' + page);
        window.open(url, "_self");
      });
    }, 1_000);
  }
}
