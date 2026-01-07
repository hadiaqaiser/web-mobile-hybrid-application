import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'tabs/tab1', pathMatch: 'full' },

  // you have tabs.routes.ts (NOT tabs.module.ts)
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },

  // details is a standalone component file
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./pages/details/details.component').then((m) => m.DetailsComponent),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
