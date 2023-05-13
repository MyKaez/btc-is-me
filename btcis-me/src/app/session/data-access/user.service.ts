import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { User } from '@ionic/cli';
import { Observable, map } from 'rxjs';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(@Inject('BTCIS.ME-API') private url: string, private httpClient: HttpClient) { }

  registerUser(sessionId: string, userName: string): Observable<User> {
    const user = { name: userName };
    return this.httpClient.post(`${this.url}/v1/sessions/${sessionId}/users`, user).pipe(
      map(value => <User>value)
    )
  }

  sendUserMessage(sessionId: string, userId: string, message: Message): Observable<User> {
    const req = {
      data: message
    };
    return this.httpClient.post(`${this.url}/v1/sessions/${sessionId}/users/${userId}/actions`, req).pipe(
      map(value => <User>value)
    )
  }
}
