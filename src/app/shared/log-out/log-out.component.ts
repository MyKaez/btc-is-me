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
        this.router.navigate([page]);
      });
    }, 1_000);
  }
}
