import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../models/user';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _baseUrl = 'https://api.btcis.me';
  //private _baseUrl = 'https://localhost:5001';

  constructor(private _httpClient: HttpClient) { }

  registerUser(sessionId: string, userName: string): Observable<User> {
    const user = { name: userName };
    return this._httpClient.post(`${this._baseUrl}/v1/sessions/${sessionId}/users`, user).pipe(
      map(value => <User>value)
    )
  }

  sendUserMessage(sessionId: string, userId: string, message: Message): Observable<User> {
    return this._httpClient.post(`${this._baseUrl}/v1/sessions/${sessionId}/users/${userId}/actions`, message).pipe(
      map(value => <User>value)
    )
  }
}
