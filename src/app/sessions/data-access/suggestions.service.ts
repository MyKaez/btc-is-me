import { Inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SessionSuggestion, UserSuggestion } from '../models/suggesion';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SuggestionsService {

  constructor(@Inject('BTCIS.ME-API') private _url: string, private _httpClient: HttpClient) { }

  suggestSession(): Observable<SessionSuggestion> {
    return this._httpClient.get(`${this._url}/v1/suggestions/sessions`).pipe(
      map(value => <SessionSuggestion>value)
    )
  }

  suggestUser(): Observable<UserSuggestion> {
    return this._httpClient.get(`${this._url}/v1/suggestions/users`).pipe(
      map(value => <UserSuggestion>value)
    )
  }
}
