import { Inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SessionSuggestion } from '../models/suggesion';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SuggestionsService {

  constructor(@Inject('BTCIS.ME-API') private _url: string, private _httpClient: HttpClient) { }

  suggest(): Observable<SessionSuggestion> {
    return this._httpClient.get(`${this._url}/v1/sessions/suggestions`).pipe(
      map(value => <SessionSuggestion>value)
    )
  }
}
