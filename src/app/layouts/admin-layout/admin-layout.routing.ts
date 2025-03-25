import { PedidosReparacionComponent } from "./../../views/pedidos-reparacion/pedidos-reparacion.component";
import { Routes } from "@angular/router";

import { DashboardComponent } from "../../dashboard/dashboard.component";
import { UserProfileComponent } from "../../user-profile/user-profile.component";
import { TableListComponent } from "../../table-list/table-list.component";
import { TypographyComponent } from "../../typography/typography.component";
import { IconsComponent } from "../../icons/icons.component";
import { MapsComponent } from "../../maps/maps.component";
import { NotificationsComponent } from "../../notifications/notifications.component";
import { UpgradeComponent } from "../../upgrade/upgrade.component";
import { MainComponent } from "app/views/main/main.component";
import { AdminProductComponent } from "app/views/admin-product/admin-product.component";
import { Component } from "@angular/core";
import { CartComponent } from "app/views/cart/cart.component";
import { OfertsComponent } from "app/views/oferts/oferts.component";
import { LoginComponent } from "app/views/login/login.component";
import { MenuAdminComponent } from "app/views/menu-admin/menu-admin.component";
import { UserComponent } from "app/views/user/user.component";
import { PublicidadComponent } from "app/views/publicidad/publicidad.component";
import { VerProductosComponent } from "app/views/ver-productos/ver-productos.component";
import { CategoriasComponent } from "app/views/categorias/categorias.component";
import { TipoProductoComponent } from "app/views/tipo-producto/tipo-producto.component";
import { UnidadProductoComponent } from "app/views/unidad-producto/unidad-producto.component";
import { GruposGeneralesComponent } from "app/views/grupos-generales/grupos-generales.component";
import { ProductosGruposComponent } from "app/views/productos-grupos/productos-grupos.component";
import { NuestrasMarcasComponent } from "app/views/nuestras-marcas/nuestras-marcas.component";
import { InfoSiliconComponent } from "app/views/info-silicon/info-silicon.component";
import { ListapedidosReparacionComponent } from "app/views/listapedidos-reparacion/listapedidos-reparacion.component";
import { ConsultarEstadoComponent } from "app/views/consultar-estado/consultar-estado.component";
import { ContactosComponent } from "app/views/contactos/contactos.component";
import { VisitanosComponent } from "app/views/visitanos/visitanos.component";
import { PoliticasComponent } from "app/views/politicas/politicas.component";
import { ProductosCategoriasComponent } from "app/views/productos-categorias/productos-categorias.component";
import { DetallesComponent } from "app/views/detalles/detalles.component";
import { GrupoComponent } from "app/views/grupo/grupo.component";
import { CategoriaComponent } from "app/views/categoria/categoria.component";
import { CrearModulosComponent } from "app/views/modulos/crear-modulos/crear-modulos.component";
import { ListarModulosComponent } from "app/views/modulos/listar-modulos/listar-modulos.component";
import { EditarModuloComponent } from "app/views/modulos/editar-modulo/editar-modulo.component";
import {AuthGuard} from "../../auth-guard.guard";
import { CrearModulosXperfilComponent } from "app/views/modulos/crear-modulos-xperfil/crear-modulos-xperfil.component";
import { ListarModulosXperfilComponent } from "app/views/modulos/listar-modulos-xperfil/listar-modulos-xperfil.component";
import { CrearMarcasComponent } from "app/views/marcas/crear-marcas/crear-marcas.component";
import { AdministrarMarcasComponent } from "app/views/marcas/administrar-marcas/administrar-marcas.component";
import { AdministarUsuarioComponent } from "app/views/user/administar-usuario/administar-usuario.component";
import { CrearUsuarioComponent } from "app/views/user/crear-usuario/crear-usuario.component";
import { VermisPerdiosComponent } from "app/views/pedidos/vermis-perdios/vermis-perdios.component";
import { CrearGaleriasComponent } from "app/views/galerias/crear-galerias/crear-galerias.component";
import { CrearCaracteristicasComponent } from "app/views/caracteristicas/crear-caracteristicas/crear-caracteristicas.component";
import { CrearsubCaracteristicasComponent } from "app/views/caracteristicas/crearsub-caracteristicas/crearsub-caracteristicas.component";
import { CrearValoresComponent } from "app/views/caracteristicas/crear-valores/crear-valores.component";
import { WelcomeProductComponent } from "app/views/before_store/welcome-product/welcome-product.component";

export const AdminLayoutRoutes: Routes = [
  // {
  //   path: '',
  //   children: [ {
  //     path: 'dashboard',
  //     component: DashboardComponent
  // }]}, {
  // path: '',
  // children: [ {
  //   path: 'userprofile',
  //   component: UserProfileComponent
  // }]
  // }, {
  //   path: '',
  //   children: [ {
  //     path: 'icons',
  //     component: IconsComponent
  //     }]
  // }, {
  //     path: '',
  //     children: [ {
  //         path: 'notifications',
  //         component: NotificationsComponent
  //     }]
  // }, {
  //     path: '',
  //     children: [ {
  //         path: 'maps',
  //         component: MapsComponent
  //     }]
  // }, {
  //     path: '',
  //     children: [ {
  //         path: 'typography',
  //         component: TypographyComponent
  //     }]
  // }, {
  //     path: '',
  //     children: [ {
  //         path: 'upgrade',
  //         component: UpgradeComponent
  //     }]
  // }

  { path: "", redirectTo: "VerTienda", pathMatch: "full", component: MainComponent },

  { path: "dashboard", component: DashboardComponent },
  { path: "user-profile", component: UserProfileComponent },
  { path: "table-list", component: TableListComponent },
  { path: "typography", component: TypographyComponent },
  { path: "icons", component: IconsComponent },
  { path: "maps", component: MapsComponent },
  { path: "notifications", component: NotificationsComponent },
  { path: "upgrade", component: UpgradeComponent },
  { path: "VerTienda", component: MainComponent },
  //Rutas para los carruseles
  { path: "detalles/:id", component: DetallesComponent }, // Ruta para detalles
  { path: "categoria/:id", component: CategoriaComponent },
  { path: "grupo/:id", component: GrupoComponent },

  //Demas rutas importante obviamente

  { path: "AdministarProductos", component: AdminProductComponent },
  { path: "cart", component: CartComponent },
  { path: "oferts", component: OfertsComponent },
  { path: "main", component: MenuAdminComponent },
  { path: "users", component: UserComponent },
  { path: 'crear-marcas', component: CrearMarcasComponent },
  { path: 'administrar-marcas', component: AdministrarMarcasComponent },
  { path: "AdministarPublicidad", component: PublicidadComponent },
  
  { path: "AdministrarCategorias", component: CategoriasComponent },
  { path: "AdministrarTipos", component: TipoProductoComponent },
  { path: "AdministrarGrupos", component: GruposGeneralesComponent },
  
  { path: "products/:id_categoria", component: VerProductosComponent },
  { path: "product/:id_imagen", component: UnidadProductoComponent },


  {path:'AdministarUsuarios',component:AdministarUsuarioComponent},
  {path:'CrearUsuario', component:CrearUsuarioComponent},
  
  { path: 'crearModuloPorPerfil', component: CrearModulosXperfilComponent},
  { path: 'listaModulosPorPerfil', component: ListarModulosXperfilComponent},


  { path: "groups/:id_grupo", component: ProductosGruposComponent },
  { path: "Ourbrands", component: NuestrasMarcasComponent },

  { path: "SolicitarRevisión", component: PedidosReparacionComponent },
  {path
    : "VerMisEquipos", component:VermisPerdiosComponent
  },

  { path: "Silicon", component: InfoSiliconComponent },

  { path: "AdministrarSolicitudes", component: ListapedidosReparacionComponent },
  { path: "searchFixed", component: ConsultarEstadoComponent },

  { path: "Contactos", component: ContactosComponent },

  { path: "visitanos", component: VisitanosComponent },

  { path: "Politicas", component: PoliticasComponent },

  { path: "ProductId/:id_categoria", component: ProductosCategoriasComponent },


{path:'crearGaleria', component: CrearGaleriasComponent},

  { path: 'crearModulo', component: CrearModulosComponent },
  { path: 'listarModulos', component: ListarModulosComponent  },
  { path: 'editarModulo', component: EditarModuloComponent  },
  { path: 'detalleModulo', component: DetallesComponent  },


  {path: 'crearCaracteristica', component: CrearCaracteristicasComponent},
  {path: 'crearSubCaracteristica', component: CrearsubCaracteristicasComponent},
  {path: 'crearValores', component: CrearValoresComponent},
// {path:'login', component: LoginComponent},
];
