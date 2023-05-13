import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './feature/main/main-routing.module';

import { MainPage } from './feature/main/main.page';
import { InputSessionComponent } from './ui/input-session/input-session.component';

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
    InputSessionComponent]
})
export class MainPageModule { }
