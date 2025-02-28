import {
  Component,
  OnInit,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";

import { Location } from "@angular/common";
import { Router, NavigationStart, ActivatedRoute } from "@angular/router";

import { LoginService } from "app/services/usuarios/login-service.service";
import { TokenValidationService } from "../../services/VerificacionUser/token-validation.service";
import { UsuarioService } from "app/services/usuarios/usuario-service.service";
import { AuthServiceService } from "app/services/AuthService/auth-service.service";
import { CategoriaServiceService } from "app/services/Categoria/categoria-service.service";
import { response } from "express";
import { error } from "console";
import { Subscription } from "rxjs";

import { CartServiceService } from "app/services/Cart/cart-service.service";
import Swal from 'sweetalert2';
import { ModulosxperfilComponent } from "app/views/modulosxperfil/modulosxperfil.component";
import { ModuloxperfilServiceService } from "app/services/moduloxperfil/moduloxperfil-service.service";

declare const $: any;

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: "/store", title: "store", icon: "dashboard", class: "" },
];

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  location: Location;
  mobile_menu_visible: any = 0;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  categorias: [];
  perfil: string = "";
  moduloXperfil: any[] = [];
  moduleRoutes: { module: string; routes: any[] }[] = [];
  collapsedModules: Set<string> = new Set();
  currentRoute = "";
  userData: any;
  loginStatusSubscription!: Subscription;
  isAdministrador = false;
  isUser = false;
  dropdownStates: { [key: string]: boolean } = {};

  menuItems: any[];

  nombre: string = "";
  cart: any[] = []; // Propiedad para almacenar los datos del carrito
  messages: string[] = [
    "Somos Silicon",
    "Innovación a tu alcance",
    "Calidad y confianza",
    "Tu tienda de tecnología",
    "Experiencia y servicio",
  ];
  isLoginRoute: boolean = false;

  currentMessage: string = this.messages[0];

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private loginService: LoginService,
    private userSrervice: UsuarioService,
    private modulosXperfilService: ModuloxperfilServiceService,
    private cdr: ChangeDetectorRef,

    private categoriaService: CategoriaServiceService,
    private tokenvalidationService: TokenValidationService,
    private authService: AuthServiceService,
    private tokenValidationService: TokenValidationService
  ) {
    this.location = location;
    this.router.events.subscribe((val) => {
      this.currentRoute = this.router.url;
    });
  }

  ngOnInit() {
    // Filtrar los elementos del menú
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    
    // Verificar la autenticación
    this.checkAuthentication();
  
    // Obtener el rol del usuario y establecer isAdmin
    this.authService.getUserRole().subscribe((role: string) => {
      this.isAdmin = role === "admin"; // Establece isAdmin si el rol es admin
    });
  
    // Suscribirse a los eventos de navegación
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.currentRoute = this.router.url; // Actualiza la ruta actual
        this.checkAuthentication(); // Verifica la autenticación en cada navegación
  
        // Si se navega a la ruta de login o raíz, actualizar el estado de inicio de sesión
        if (event.url === "/login" || event.url === "/") {
          this.isLoggedIn = false;
          localStorage.setItem("isLoggedIn", JSON.stringify(false));
        }
      }
    });

 
    // Obtener el estado de inicio de sesión almacenado
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    this.isLoggedIn = storedLoginStatus ? JSON.parse(storedLoginStatus) : false;
    localStorage.setItem("isLoggedIn", JSON.stringify(this.isLoggedIn));
  
    // Validar el token si el usuario está conectado
    if (this.isLoggedIn) {
      this.validateToken();
    }
  
    // Suscribirse a los cambios de estado de inicio de sesión
    this.loginStatusSubscription = this.loginService.loginStatusChanged.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
      if (isLoggedIn) {
        this.fetchUsername(); // Obtener el nombre de usuario si está conectado
      } else {
        this.nombre = ""; // Limpiar el nombre si no está conectado
      }
    });
  }

  private checkIfLoginRoute(url: string): void {
    const hiddenRoutes = ["/login"];
    this.isLoginRoute = hiddenRoutes.includes(url);
  }

  private validateToken(): void {
    const storedToken = this.tokenvalidationService.getToken();

    if (storedToken) {
      const isValidToken =
        this.tokenvalidationService.isValidToken(storedToken);

      if (isValidToken) {
        this.isLoggedIn = true;
        this.fetchUsername();
      } else {
        this.isLoggedIn = false;
        this.router.navigate(["/login"]);
      }
    } else {
      this.isLoggedIn = false;
    }
  }

  irALogin() {
    this.router.navigate(["/login"]); // Asegúrate de tener la ruta configurada para la página de inicio de sesión
  }

  irARegister() {
    this.router.navigate(["/registro"]); // Asegúrate de tener la ruta configurada para la página de inicio de sesión
  }

  listarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe(
      (response) => {
        this.categorias = response.data;
        console.log("CategoriaS LISTADAS", response.data);
      },
      (error) => {
        console.log("No se pudieron listar las Categorias", error);
      }
    );
  }

  navigateToCategory(id_categoria: number): void {
    console.log("Navegando a la categoría con ID:", id_categoria);

    this.router.navigate(["/products", id_categoria]);
  }

  abrirCarrito() {
    this.router.navigate(["/cart"]); // Usa paréntesis para llamar a la función
  }

  // Método para cerrar sesión
  cerrarSesion() {
    this.loginService.cerrarSesion().subscribe(
      (response) => {
        Swal.fire({
          title: "¿Realmente quieres salir?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Salir",
        }).then((result) => {
          if (result.isConfirmed) {
            this.loginService.removerToken();
            localStorage.setItem("isLoggedIn", JSON.stringify(false));

            this.router.navigate(["store"]);
            window.location.reload();

            history.replaceState(null, "", "/");
          }
        });
      },
      (error) => {
        console.error("Error al cerrar sesión:", error);
      }
    );
  }

  isCollapsed(module: string): boolean {
    return this.collapsedModules.has(module);
  }
  
  toggleCollapse(module: string): void {
    if (this.collapsedModules.has(module)) {
      this.collapsedModules.delete(module);
    } else {
      this.collapsedModules.add(module);
    }
  }

  private fetchUsername(): void {
    const storedToken = this.tokenvalidationService.getToken();
    if (storedToken) {
      const userId =
        this.tokenvalidationService.getUserData(storedToken).userId;
      this.userSrervice.obtenerUsuarioId(userId).subscribe(
        (response) => {
          if (response && response.user) {
            this.nombre = response.user.nombre;
            this.perfil = response.user.perfil;
          } else {
            console.error("Faltan datos de usuario en la respuesta");
          }
        },
        (error) => {
          console.error("Error al obtener el usuario:", error);
        }
      );
    }
  }

  async checkAuthentication() {
    try {
      const token = localStorage.getItem("token");
      if (token && (await this.tokenValidationService.isValidToken(token))) {
        this.isLoggedIn = true;
        this.userData = await this.tokenValidationService.getUserData(token);
        this.setUserRoles(this.userData.idperfil);
        this.obtenerModulosPorPerfil(this.userData.idperfil);
        this.cdr.detectChanges(); // Realizar detección de cambios
      }
    } catch (error) {
      console.error("Error al verificar la autenticación:", error);
    }
  }

  sanitizeId(moduleName: string): string {
    return 'collapse' + moduleName.replace(/\s+/g, '');
  }
  

  setUserRoles(idperfil: Number) {
    if (idperfil) {
      this.isAdministrador = idperfil === 1;
      this.isUser = idperfil === 2;
    }
  }

  obtenerModulosPorPerfil(idperfil: number) {
    this.modulosXperfilService.obtenerModulosPorPerfil(idperfil).subscribe(
      (response) => {
        console.log("id del perfil logueado:", idperfil);
        
        const groupedModules = response.data.reduce((acc, curr) => {
          if (!acc[curr.modulo]) {
            acc[curr.modulo] = [];
          }

          // Verificar duplicados de url_modulo
          if (
            !acc[curr.modulo].some(
              (route) => route.url_modulo === curr.url_modulo
            )
          ) {
            acc[curr.modulo].push(curr);
          }

          return acc;
        }, {});



        // Filtrar módulos para incluir solo aquellos con rutas que tienen permiso 'si'
        this.moduleRoutes = Object.keys(groupedModules)
          .map((module) => ({
            module,
            routes: groupedModules[module].filter(
              (route) => route.permiso === "si"
            ),
          }))
          .filter((moduleRoute) => moduleRoute.routes.length > 0);
      },
      (error) => {
        console.error("Error al obtener los módulos por perfil:", error);
      }
    );
  }


  
  toggleDropdown(moduleName: string) {
    this.dropdownStates[moduleName] = !this.dropdownStates[moduleName];
  }

  isDropdownOpen(moduleName: string): boolean {
    return this.dropdownStates[moduleName] || false;
  }

}
