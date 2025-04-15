import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { NgxPaginationModule } from 'ngx-pagination';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { MainComponent } from './views/main/main.component';
import { CartComponent } from './views/cart/cart.component';
import { AdminProductComponent } from './views/admin-product/admin-product.component';
import { OfertsComponent } from './views/oferts/oferts.component';
import { EditProductComponent } from './modal/edit-product/edit-product.component';
import { SeeProductComponent } from './modal/see-product/see-product.component';
import { ReservesComponent } from './views/reserves/reserves.component';
import { LoginComponent } from './views/login/login.component';
import { MenuAdminComponent } from './views/menu-admin/menu-admin.component';
import { EditUserComponent } from './modal/edit-user/edit-user.component';
import { SeeUserComponent } from './modal/see-user/see-user.component';
import { UserComponent } from './views/user/user.component';
import { EmptyLayoutComponent } from './layouts/empty-layout/empty-layout.component';
import { LoginService } from './services/usuarios/login-service.service';
import { JwtModule } from '@auth0/angular-jwt';
import { MarcasComponent } from './views/marcas/marcas.component';
import { CategoriasComponent } from './views/categorias/categorias.component';
import { PublicidadComponent } from './views/publicidad/publicidad.component';
import { VerProductosComponent } from './views/ver-productos/ver-productos.component';
import { TipoProductoComponent } from './views/tipo-producto/tipo-producto.component';
import { UnidadProductoComponent } from './views/unidad-producto/unidad-producto.component';
import { GruposGeneralesComponent } from './views/grupos-generales/grupos-generales.component';
import { ProductosGruposComponent } from './views/productos-grupos/productos-grupos.component';
import { NuestrasMarcasComponent } from './views/nuestras-marcas/nuestras-marcas.component';
import { PedidosReparacionComponent } from './views/pedidos-reparacion/pedidos-reparacion.component';
import { InfoSiliconComponent } from './views/info-silicon/info-silicon.component';
import { ListapedidosReparacionComponent } from './views/listapedidos-reparacion/listapedidos-reparacion.component';
import { ConsultarEstadoComponent } from './views/consultar-estado/consultar-estado.component';
import { ContactosComponent } from './views/contactos/contactos.component';
import { VisitanosComponent } from './views/visitanos/visitanos.component';
import { PoliticasComponent } from './views/politicas/politicas.component';
import { ProductosCategoriasComponent } from './views/productos-categorias/productos-categorias.component';
import { RegistroComponent } from './views/register/register.component';
import { DetallesComponent } from './views/detalles/detalles.component';
import { CategoriaComponent } from './views/categoria/categoria.component';
import { GrupoComponent } from './views/grupo/grupo.component';
import { ModulosComponent } from './views/modulos/modulos.component';
import { CrearModulosXperfilComponent } from './views/modulos/crear-modulos-xperfil/crear-modulos-xperfil.component';
import { ListarModulosXperfilComponent } from './views/modulos/listar-modulos-xperfil/listar-modulos-xperfil.component';
import { CrearModulosComponent } from './views/modulos/crear-modulos/crear-modulos.component';
import { DetalleModulosComponent } from './views/modulos/detalle-modulos/detalle-modulos.component';
import { EditarModuloComponent } from './views/modulos/editar-modulo/editar-modulo.component';
import { ListarModulosComponent } from './views/modulos/listar-modulos/listar-modulos.component';
import { AdministrarMarcasComponent } from './views/marcas/administrar-marcas/administrar-marcas.component';
import { CrearMarcasComponent } from './views/marcas/crear-marcas/crear-marcas.component';
import { CrearUsuarioComponent } from './views/user/crear-usuario/crear-usuario.component';
import { AdministarUsuarioComponent } from './views/user/administar-usuario/administar-usuario.component';
import { VermisPerdiosComponent } from './views/pedidos/vermis-perdios/vermis-perdios.component';
import { CrearGaleriasComponent } from './views/galerias/crear-galerias/crear-galerias.component';
import { CrearCaracteristicasComponent } from './views/caracteristicas/crear-caracteristicas/crear-caracteristicas.component';
import { CrearsubCaracteristicasComponent } from './views/caracteristicas/crearsub-caracteristicas/crearsub-caracteristicas.component';
import { CrearValoresComponent } from './views/caracteristicas/crear-valores/crear-valores.component';
import { WelcomeProductComponent } from './views/before_store/welcome-product/welcome-product.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ComponentsModule } from '.././app/components/components.module';
import { DataInfoComponent } from './views/data-info/data-info.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  imports: [ BrowserModule,

    
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
      
      },
    }),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule, // 👈 AGREGA ESTO

    RouterModule,
    NgxPaginationModule,
    AppRoutingModule,
    MatIconModule
    
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    MainComponent,
    CartComponent,
    SeeUserComponent,
    EditUserComponent,
    AdminProductComponent,
    OfertsComponent,
    EditProductComponent,
    SeeProductComponent,
    ReservesComponent,
    LoginComponent,
    MenuAdminComponent,
    EditUserComponent,
    SeeUserComponent,
    UserComponent,
    EmptyLayoutComponent,
    RegistroComponent,
    MarcasComponent,
    CategoriasComponent,
    PublicidadComponent,
    VerProductosComponent,
    TipoProductoComponent,
    UnidadProductoComponent,
    GruposGeneralesComponent,
    ProductosGruposComponent,
    NuestrasMarcasComponent,
    PedidosReparacionComponent,
    InfoSiliconComponent,
    ListapedidosReparacionComponent,
    ConsultarEstadoComponent,
    ContactosComponent,
    VisitanosComponent,
    PoliticasComponent,
    ProductosCategoriasComponent,
    DetallesComponent,
    CategoriaComponent,
    GrupoComponent,
    ModulosComponent,
    CrearModulosXperfilComponent,
    ListarModulosXperfilComponent,
    CrearModulosComponent,
    DetalleModulosComponent,
    EditarModuloComponent,
    ListarModulosComponent,
    AdministrarMarcasComponent,
    CrearMarcasComponent,
    CrearUsuarioComponent,
    AdministarUsuarioComponent,
    VermisPerdiosComponent,
    CrearGaleriasComponent,
    CrearCaracteristicasComponent,
    CrearsubCaracteristicasComponent,
    CrearValoresComponent,
    WelcomeProductComponent,
    DataInfoComponent
    

  ],
  providers: [
    LoginService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true // Esto indica que puedes tener múltiples interceptores
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
