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
import { DataInfoService } from '../../services/data-info.service';

import { CartServiceService } from "app/services/Cart/cart-service.service";
import Swal from 'sweetalert2';
import { ModuloxperfilServiceService } from "app/services/moduloxperfil/moduloxperfil-service.service";

declare const $: any;

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}


export const ROUTES: RouteInfo[] = [
  { path: "/VerTienda", title: "store", icon: "dashboard", class: "" },
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
  listaDataInfo: any[] = [];

  menuItems: any[];
  selectedCategory: string = '';
  selectedOption: string = '';
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
    private dataservice: DataInfoService,
    private categoriaService: CategoriaServiceService,
    private authService: AuthServiceService,
    private tokenvalidationService: TokenValidationService
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


    this.dataservice.getAll().subscribe(data => {
      this.listaDataInfo = data;
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
  handleCategorySelect(category: string) {
    this.selectedCategory = category;
  }

  handleOptionSelect(option: string) {
    this.selectedOption = option;
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
            this.isLoggedIn = false; // Actualiza el estado aquí también
            this.router.navigate(["store"]);
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
    const userData = this.tokenvalidationService.getUserData(storedToken);
    if (userData && userData.userId) {
      const userId = userData.userId;
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
    } else {
      console.warn("El token no contiene datos válidos del usuario.");
    }
    
  }

  async checkAuthentication(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;
  
      if (token && (await this.tokenvalidationService.isValidToken(token))) {
        this.userData = await this.tokenvalidationService.getUserData(token);
        this.setUserRoles(this.userData.idperfil);
        this.cdr.detectChanges(); // Detectar cambios manualmente
      } else {
        this.isLoggedIn = false;
      }
    } catch (error) {
      console.error("Error al verificar la autenticación:", error);
      this.isLoggedIn = false;
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

  


  
  toggleDropdown(moduleName: string) {
    this.dropdownStates[moduleName] = !this.dropdownStates[moduleName];
  }

  isDropdownOpen(moduleName: string): boolean {
    return this.dropdownStates[moduleName] || false;
  }



}
