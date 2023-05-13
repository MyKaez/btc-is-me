import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './feature/main/main-routing.module';

import { MainPage } from './feature/main/main.page';
import { InputSessionComponent } from './ui/input-session/input-session.component';
import { SessionInfoComponent } from './ui/session-info/session-info.component';
import { UserInfoComponent } from './ui/user-info/user-info.component';
import { HostComponent } from './feature/host/host.component';
import { UserComponent } from './feature/user/user.component';
import { SendMessageComponent } from './ui/send-message/send-message.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MainPageRoutingModule
  ],
  declarations: [
    MainPage,
    HostComponent,
    UserComponent,
    InputSessionComponent,
    SessionInfoComponent,
    UserInfoComponent,
    SendMessageComponent
  ]
})
export class SessionModule { }
