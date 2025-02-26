import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { EmptyLayoutComponent } from './layouts/empty-layout/empty-layout.component';
import { LoginComponent } from './views/login/login.component';
import { RegistroComponent } from './views/register/register.component';
import { WelcomeProductComponent } from './views/before_store/welcome-product/welcome-product.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./layouts/admin-layout/admin-layout.module').then(
            (m) => m.AdminLayoutModule
          ),
      },
    ],
  },
  // Ruta para login
  {
    path: 'login',
    component: EmptyLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
    ],
  },

    // Ruta para login
    {
      path: 'CrearProducto',
      component: EmptyLayoutComponent,
      children: [
        {path:'', component: WelcomeProductComponent}
      ],
    },
  // Ruta para registro
  {
    path: 'registro',
    component: EmptyLayoutComponent,
    children: [
      { path: '', component: RegistroComponent },
    ],
  },

];


@NgModule({
  imports: [

    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}