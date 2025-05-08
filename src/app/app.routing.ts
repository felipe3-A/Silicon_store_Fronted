import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { EmptyLayoutComponent } from "./layouts/empty-layout/empty-layout.component";
import { LoginComponent } from "./views/login/login.component";
import { RegistroComponent } from "./views/register/register.component";
import { WelcomeProductComponent } from "./views/before_store/welcome-product/welcome-product.component";
import { ContactosComponent } from "./views/Organizacion_Silicon/contactos/contactos.component";
import { VisitanosComponent } from "./views/Organizacion_Silicon/visitanos/visitanos.component";
import { MisionVisionComponent } from "./views/Organizacion_Silicon/mision-vision/mision-vision.component";
import { PortafolioComponent } from "./views/Organizacion_Silicon/portafolio/portafolio.component";
import { QuienesSomosComponent } from "./views/Organizacion_Silicon/quienes-somos/quienes-somos.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./layouts/admin-layout/admin-layout.module").then(
            (m) => m.AdminLayoutModule
          ),
      },
    ],
  },
  // Ruta para login
  {
    path: "login",
    component: EmptyLayoutComponent,
    children: [{ path: "", component: LoginComponent }],
  },

  // Ruta para login
  {
    path: "CrearProducto",
    component: EmptyLayoutComponent,
    children: [{ path: "", component: WelcomeProductComponent }],
  },
  // Ruta para registro
  {
    path: "registro",
    component: EmptyLayoutComponent,
    children: [{ path: "", component: RegistroComponent }],
  },

  {
    path: "contactos",
    component: EmptyLayoutComponent,
    children: [{ path: "", component: ContactosComponent }],
  },

  {
    path: "visitanos",
    component: EmptyLayoutComponent,
    children: [{ path: "", component: VisitanosComponent }],
  },
  {
    path: "misionVision",
    component: EmptyLayoutComponent,
    children: [{ path: "", component: MisionVisionComponent }],
  },
  {
    path: "portafolioSilicon",
    component: EmptyLayoutComponent,
    children: [{ path: "", component: PortafolioComponent }],
  },
  {
    path: "IdentidadSilicon",
    component: EmptyLayoutComponent,
    children: [{ path: "", component: QuienesSomosComponent }],
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
