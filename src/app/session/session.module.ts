import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './feature/main/main-routing.module';

import { MainPage } from './feature/main/main.page';
import { InputSessionComponent } from './ui/input-session/input-session.component';
import { SessionInfoComponent } from './ui/session-info/session-info.component';
import { UserInfoComponent } from './ui/user-info/user-info.component';
import { HostActionsComponent } from './ui/host-actions/host-actions.component';
import { UserComponent } from './feature/user/user.component';
import { SendMessageComponent } from './ui/send-message/send-message.component';
import { MessageCenterComponent } from './feature/message-center/message-center.component';
import { SessionListComponent } from './ui/session-list/session-list.component';
import { QRCodeModule } from 'angularx-qrcode';
import { HashListComponent } from './ui/hash-list/hash-list.component';
import { ProofOfWorkComponent } from './ui/proof-of-work/proof-of-work.component';

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
    HostActionsComponent,
    UserComponent,
    MessageCenterComponent,
    InputSessionComponent,
    SessionInfoComponent,
    UserInfoComponent,
    SendMessageComponent,
    SessionListComponent,
    HashListComponent,
    ProofOfWorkComponent
  ]
})
export class SessionModule { }
