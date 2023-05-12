import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionComponent } from './sessions/feature/session-main/session.component';

const routes: Routes = [
  { path: 'sessions', component: SessionComponent },
  { path: 'sessions/:sessionId', component: SessionComponent },
  { path: '', redirectTo: '/sessions', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
