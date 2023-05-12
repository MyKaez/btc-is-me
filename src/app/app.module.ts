import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SessionComponent } from './session/session.component';
import { SessionInfoComponent } from './views/session-info/session-info.component';
import { SessionCreatorComponent } from './views/session-creator/session-creator.component';
import { SessionsHostComponent } from './views/session-host/session-host.component';
import { SessionsUserComponent } from './views/sessions-user/sessions-user.component';
import { SendMessageComponent } from './views/sessions-user/send-message/send-message.component';

@NgModule({
  declarations: [
    AppComponent,
    SessionComponent,
    SessionInfoComponent,
    SessionCreatorComponent,
    SessionsHostComponent,
    SessionsUserComponent,
    SendMessageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
