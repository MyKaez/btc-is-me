import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/user';
import { SessionInfo } from '../../models/session';
import { Block } from '../../models/block';
import { of, take } from 'rxjs';
import { SHA256 } from 'crypto-js';

@Component({
  selector: 'app-hash-list',
  templateUrl: './hash-list.component.html',
  styleUrls: ['./hash-list.component.scss'],
})
export class HashListComponent {
  @Input("session") session?: SessionInfo;
  @Input("user") user?: User;
  @Output("hashChange") hashChange = new EventEmitter<Block>();

  private hashes: Block[] = [];

  blocks$ = of(this.hashes).pipe(
    //tap(blocks => blocks[0].hash < this.session?.configuration?.threshold)
    take(100)
  );


  determine(): number {
    const template = `${this.user!.id}_${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}'_`
    for (let i = 0; i < 10; i++) {
      const text = template + i;
      const hash = SHA256(text).toString();
      const block = {
        userId: this.user!.id,
        text: text,
        hash: hash
      };
      this.hashes.unshift(block);
    }
    return 200;
  }
}
