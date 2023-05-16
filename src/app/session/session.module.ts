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
import { MessageCenterComponent } from './feature/message-center/message-center.component';
import { SessionListComponent } from './ui/session-list/session-list.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MainPageRoutingModule,
    QRCodeModule
  ],
  declarations: [
    MainPage,
    HostComponent,
    UserComponent,
    MessageCenterComponent,
    InputSessionComponent,
    SessionInfoComponent,
    UserInfoComponent,
    SendMessageComponent,
    SessionListComponent
  ]
})
export class SessionModule { }
