import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SessionComponent } from './sessions/feature/session-main/session.component';
import { SessionInfoComponent } from './sessions/ui/session-info/session-info.component';
import { SessionCreatorComponent } from './views/session-creator/session-creator.component';
import { SessionsHostComponent } from './views/session-host/session-host.component';
import { SessionUserComponent } from './views/session-user/session-user.component';
import { SendMessageComponent } from './sessions/ui/send-message/send-message.component';

@NgModule({
  declarations: [
    AppComponent,
    SessionComponent,
    SessionInfoComponent,
    SessionCreatorComponent,
    SessionsHostComponent,
    SessionUserComponent,
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
