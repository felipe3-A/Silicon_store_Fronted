import {
  Component,
  OnInit,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import { crearSlug } from '../../../app/shared/utils';

import { Location } from "@angular/common";
import { Router, NavigationStart, ActivatedRoute } from "@angular/router";
import { of, Observable } from 'rxjs';
import { LoginService } from "app/services/usuarios/login-service.service";
import { TokenValidationService } from "../../services/VerificacionUser/token-validation.service";
import { UsuarioService } from "app/services/usuarios/usuario-service.service";
import { AuthServiceService } from "app/services/AuthService/auth-service.service";
import { CategoriaServiceService } from "app/services/Categoria/categoria-service.service";
import { response } from "express";
import { error } from "console";
import { Subscription } from "rxjs";
import { DataInfoService } from "../../services/data-info.service";

import { CartServiceService } from "app/services/Cart/cart-service.service";
import Swal from "sweetalert2";
import { ModuloxperfilServiceService } from "app/services/moduloxperfil/moduloxperfil-service.service";
import { ProductService } from "app/services/product.service";
import { Item } from "app/model/ProductosModel";
import { map, finalize } from 'rxjs/operators';

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
  filtroBusqueda: string = "";
  textoBusqueda: string = '';
  sugerencias: any[] = [];

  productos: any[] = [];
  productosFiltrados: any[] = [];
  menuItems: any[];
  selectedCategory: string = "";
  selectedOption: string = "";
  nombre: string = "";
  cart: any[] = []; // Propiedad para almacenar los datos del carrito
  messages: string[] = [
    "Somos Silicon",
    "Innovación a tu alcance",
    "Calidad y confianza",
    "Tu tienda de tecnología",
    "Experiencia y servicio",
  ];
    carruselImgs: string[] = [
    'assets/img/Carrusel_imagenes (1).png',
    'assets/img/Carrusel_imagenes (2).png',
    'assets/img/Carrusel_imagenes (3).png',
    'assets/img/Carrusel_imagenes (4).png',
    'assets/img/Carrusel_imagenes (5).png',
    'assets/img/Carrusel_imagenes.png'
  ];
  isLoginRoute: boolean = false;
  filtroCategoria: string = "";
  currentMessage: string = this.messages[0];
  
  isloading: boolean = false;
src: string = '';
data$: Observable<Item[]> = of([]);

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
    private tokenvalidationService: TokenValidationService,
    private productosservice : ProductService
  ) {
    this.location = location;
    this.router.events.subscribe((val) => {
      this.currentRoute = this.router.url;
    });
  }

  ngOnInit() {+
    this.listarCategorias();
    // Filtrar los elementos del menú
    this.menuItems = ROUTES.filter((menuItem) => menuItem);

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

    this.dataservice.getAll().subscribe((data) => {
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
    this.loginStatusSubscription =
      this.loginService.loginStatusChanged.subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
        localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
        if (isLoggedIn) {
          this.fetchUsername(); // Obtener el nombre de usuario si está conectado
        } else {
          this.nombre = ""; // Limpiar el nombre si no está conectado
        }
      });


      this.productosservice.listarProductos().subscribe((res: any[]) => {
        this.productos = res;
      });
  }
  buscar() {
    if (!this.textoBusqueda || this.textoBusqueda.trim() === '') {
      this.sugerencias = [];
      return;
    }
  
    const texto = this.textoBusqueda.toLowerCase();
  
    this.sugerencias = this.productos.filter(item =>
      item.name.toLowerCase().includes(texto) &&
      item.total_quantity > 0 // Aquí filtramos los que tienen total_quantity mayor a 0
    );
  }
  

  

  crearSlug(nombre: string): string {
    return nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, '-');
  }

  seleccionar(nombre: string): void {
    const producto = this.productos.find(p => p.name === nombre);
    if (producto) {
      this.textoBusqueda = nombre;
      this.sugerencias = [];
  
      // Navegar al detalle del producto con su ID
      this.router.navigate(['/producto', producto.item_id]);
    }
  }



  
 


  irADetalle(producto: any): void {
    this.router.navigate(["/producto", producto.id]); // Redirige a la vista de detalle
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
    this.categoriaService.listarCategorias().subscribe({
      next: (data) => {
        this.categorias = data; // Asigna las categorías al array
        console.log("Categorías cargadas:", this.categorias); // Imprime las categorías en la consola
      },
      error: (err) => {
        console.error("Error al cargar las categorías:", err);
      },
    });
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
    Swal.fire({
      title: `¿${this.nombre} quieres cerrar sesión?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.loginService.cerrarSesion().subscribe({
          next: (res) => {
            this.loginService.loginStatusChanged.emit(false); // <- Esto actualizará todo lo que escucha cambios de login
            this.isLoggedIn = false;
            this.nombre = "";
            localStorage.setItem("isLoggedIn", "false");
            this.router.navigate(["/verTienda"]);
            Swal.fire(
              "¡Sesión cerrada!",
              "Has cerrado sesión correctamente.",
              "success"
            );
          },
          error: (err) => {
            console.error("Error al cerrar sesión", err);
            Swal.fire("Error", "No se pudo cerrar sesión.", "error");
          },
        });
      }
    });
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
      const token = localStorage.getItem("token");
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
    return "collapse" + moduleName.replace(/\s+/g, "");
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
