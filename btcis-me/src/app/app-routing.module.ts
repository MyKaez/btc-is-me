import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'session',
    pathMatch: 'full'
  },
  {
    path: 'session',
    loadChildren: () => import('./session/main.module').then(m => m.MainPageModule)
  },
  {
    path: 'session:id',
    loadChildren: () => import('./session/main.module').then(m => m.MainPageModule)
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then(m => m.FolderPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
