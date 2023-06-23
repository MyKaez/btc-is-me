import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LogOutComponent } from './shared/log-out/log-out.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'session',
    pathMatch: 'full'
  },
  {
    path: 'session',
    loadChildren: () => import('./session/session.module').then(m => m.SessionModule)
  },
  {
    path: 'session/:id',
    loadChildren: () => import('./session/session.module').then(m => m.SessionModule)
  },
  {
    path: 'log-out/:page',
    component: LogOutComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
