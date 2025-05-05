import { map } from "rxjs/operators";
import { CartComponent } from "./../cart/cart.component";
import { Component, OnInit } from "@angular/core";
import { ProductService } from "app/services/product.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PublicidadServiceService } from "app/services/Publicidad/publicidad-service.service";
import { MarcasServiceService } from "app/services/Marcas/marcas-service.service";
import { response } from "express";
import { CategoriaServiceService } from "app/services/Categoria/categoria-service.service";
import { GrupoServiceService } from "app/services/Grupo/grupo-service.service";
import { LoginService } from "app/services/usuarios/login-service.service";
import { CartProductsService } from "app/services/CartProduct/cart-product.service";
import { CartServiceService } from "app/services/Cart/cart-service.service";
import { error, log } from "console";
import { ViewChild, ElementRef } from "@angular/core";
import { AfterViewInit } from "@angular/core";

declare var bootstrap: any;

@Component({
  selector: "main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"],
})
export class MainComponent implements OnInit, AfterViewInit {
  marcas: [];
  publicidad = [];
  productXcategorias = [];
  ofertas = [];
  descuentos = [];
  promociones = [];
  categoriasForm = [];
  currentImageIndex: number = 0;

  grupos = [];
  // Listar las categorias

  listCategorias: any[] = [];
  productosPorCategoria: { [key: number]: any[] } = {}; // Para almacenar productos por categoría

  carrito_id: number | null = null; // Para almacenar el ID del carrito

  userId: string | null = null;

  //Aqui se guardaran los productos sin embargo no las esta listando
  //Ya que esto devuelve un array vacio
  carrito: any[] = [];

  productoForm: FormGroup;
  carritoForm: FormGroup;
  redIndex = 0;
  bannerIndex = 0;
  ProductoData = {
    people_id: this.userId,
    item_id: null, // Replace with the correct item ID
    cantidad: 1, // Default quantity or dynamic based on the UI
    precio: null, // Replace with the correct price
    addedAt: Date.now(), // Example to set the current timestamp
  };
  categorias: any[] = [];
  productos: any[] = [];
  categoriaSeleccionada: string | null = null;

  iconosCategoria: { [key: string]: string } = {
    TELEVISION: "tv",
    Ropa: "checkroom",
    Alimentos: "restaurant",
    Libros: "menu_book",
    Hogar: "chair",
    Otro: "category",
  };
  filtroBusqueda: string = "";
  filtroCategoria: string = "";
  productosFiltrados: any[] = [];
  televisores: any[] = [];

  @ViewChild("carousel") carousel!: ElementRef;
  @ViewChild("myCarousel", { static: false }) carouselElement!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private cartProductService: CartProductsService,
    private productService: ProductService,
    private router: Router,
    private publicidadService: PublicidadServiceService,
    private authService: LoginService,
    private categoriaServicie: CategoriaServiceService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();

    if (this.userId) {
      this.authService.obtenerCarritoId(+this.userId).subscribe({
        next: (data) => {
          this.carrito_id = data.carrito_id;
          console.log("🛒 ID del carrito obtenido:", this.carrito_id);
        },
        error: (err) => {
          console.error("❌ Error al obtener el carrito del usuario:", err);
        },
      });
    }
    setInterval(() => {
      this.redIndex = (this.redIndex + 1) % 2; // 2 imágenes en columna1
    }, 3000);
  
    setInterval(() => {
      this.bannerIndex = (this.bannerIndex + 1) % 3; // 3 imágenes en columna2
    }, 3500); // Puedes variar el tiempo si quieres un ritmo diferente

    this.listarTelevisores();
    this.listarProductos();
    this.obtenerPublicidad();
    this.listarCategorias();

    this.productoForm = this.fb.group({
      nombre: ["", Validators.required],
      descripcion: ["", Validators.required],
      precio: ["", [Validators.required, Validators.min(0)]],
    });
  }

  aplicarFiltros(): void {
    const texto = this.filtroBusqueda?.toLowerCase() || "";
    const categoria = this.filtroCategoria;

    this.productosFiltrados = this.productos.filter(
      (producto) =>
        (producto.name.toLowerCase().includes(texto) ||
          producto.category.toLowerCase().includes(texto)) &&
        (!categoria || producto.category === categoria)
    );
  }

  resetFiltros(): void {
    this.filtroBusqueda = "";
    this.filtroCategoria = "";
    this.productosFiltrados = [...this.productos];
  }
  obtenerPublicidad() {
    this.publicidadService.listarPublicidad().subscribe({
      next: (data) => {
        console.log("Imágenes de publicidad:", data);
        this.publicidad = data.map((imagen: any) => ({
          ...imagen,
          image_url: `http://127.0.0.1:8000/storage/${imagen.image_url}`,
        }));
      },
      error: (error) => {
        console.error("Error al obtener la publicidad:", error);
      },
    });
  }
  scrollCarousel(direction: number) {
    const amount = 260; // cantidad en px a desplazar
    this.carousel.nativeElement.scrollBy({
      left: amount * direction,
      behavior: "smooth",
    });
  }

  seleccionarCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.categoriaServicie.obtenerProductosPorCategoria(categoria).subscribe({
      next: (productos) => {
        this.productos = productos;
        console.log("📦 Productos de la categoría:", productos);
      },
      error: (err) => {
        console.error("❌ Error al obtener productos por categoría:", err);
      },
    });
  }

  ngAfterViewInit(): void {
    if (this.carouselElement) {
      new bootstrap.Carousel(this.carouselElement.nativeElement, {
        interval: 4000,
        ride: "carousel",
        pause: false, // evita que se detenga al pasar el mouse
        wrap: true,
      });
    }
  }

  obtenerIcono(categoria: string): string {
    return this.iconosCategoria[categoria] || "category";
  }

  verProducto(item_id: number) {
    this.router.navigate(["/producto", item_id]);
  }

  // Método para navegar a la categoría específica
  // Método para navegar a las categorías del grupo
  navigateToCategoryforGroups(id_grupo: number[]): void {
    console.log("Navegando a el grupo con IDs:", id_grupo);
    this.router.navigate(["/groups", id_grupo]); // Pasar las categorías como un objeto
  }
  listarCategorias(): void {
    this.categoriaServicie.listarCategorias().subscribe({
      next: (data) => {
        this.categorias = data; // Asigna las categorías al array
        console.log("Categorías cargadas:", this.categorias); // Imprime las categorías en la consola
      },
      error: (err) => {
        console.error("Error al cargar las categorías:", err);
      },
    });
  }

  // Método para navegar a la categoría específica
  navigateToCategory(categoria: String): void {
    console.log("Navegando a la categoría con ID:", categoria);
    this.router.navigate(["/products", categoria]);
  }

  // Método para navegar a la categoría específica
  navigateToCategoryandProduct(id_imagen: number): void {
    console.log("Navegando el producto con ID:", id_imagen);
    this.router.navigate(["/product", id_imagen]);
  }

  listarTelevisores() {
    this.categoriaServicie
      .obtenerProductosPorCategoria("ACCESORIOS")
      .subscribe({
        next: (productos) => {
          this.televisores = productos.filter(
            (p) => p.deleted === 0 && p.total_quantity > 0
          );
          this.televisores.forEach((producto) => {
            producto.imagen = producto.pic_filename
              ? `http://localhost:8082/uploads/item_pics/${producto.pic_filename}`
              : "assets/img/404.png";
          });
          console.log("📺 Productos de TELEVISIÓN:", this.televisores);
        },
        error: (err) => {
          console.error("❌ Error al obtener televisores:", err);
        },
      });
  }

  verMasInformacion(producto: any): void {
    console.log("Ver más información de:", producto);
    // Lógica para redirigir a una página de detalles del producto o mostrar más información
  }

  agregarAFavoritos(producto: any): void {
    console.log("Producto agregado a favoritos:", producto);
    // Lógica para agregar el producto a una lista de favoritos
  }

  listarProductos() {
    this.productService.listarProductos().subscribe({
      next: (productos: any[]) => {
        // Filtramos de nuevo por seguridad, aunque el backend ya lo hace
        this.productos = productos.filter(
          (p) => p.deleted === 0 && p.total_quantity > 0
        );

        // Asignar la URL de la imagen para cada producto
        this.productos.forEach((producto) => {
          producto.imagen = producto.pic_filename
            ? `http://localhost:8082/uploads/item_pics/${producto.pic_filename}`
            : "assets/img/404.png";
        });

        console.log("📦 Productos cargados:", this.productos);
        this.productosFiltrados = [...this.productos]; // Inicializa con todos los productos
      },

      error: (err) => {
        console.error("❌ Error al listar productos:", err);
      },
    });
  }

  // Función para convertir la imagen en base64 a un Blob si es necesario
  dataURLtoBlob(dataURL: string): Blob {
    const parts = dataURL.split(",");
    if (parts.length !== 2) {
      throw new Error("El Data URL está mal formado.");
    }

    const base64Data = parts[1];
    const byteString = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([uintArray], { type: "image/*" });
  }

  // Componente
  agregarProductoAlCarrito(producto: any): void {
    const idUsuario = this.authService.getUserId();

    if (!idUsuario) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "Usuario no logueado. Por favor inicia sesión.",
        confirmButtonText: "Cerrar",
      });
      return;
    }

    // Ya no necesitas obtener el carrito_id si no es parte del backend
    const productoData = {
      person_id: Number(idUsuario),
      item_id: producto.item_id,
      quantity: 1,
    };

    Swal.fire({
      icon: "info",
      title: "Enviando al backend...",
      text: "Por favor espera mientras procesamos tu solicitud.",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.cartProductService.agregarProductoAlCarrito(productoData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: "success",
          title: "¡Producto agregado al carrito!",
          text: "El producto se ha agregado correctamente.",
          confirmButtonText: "Aceptar",
        });
      },
      error: (err) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al agregar el producto al carrito. Intenta nuevamente.",
          confirmButtonText: "Cerrar",
        });
      },
    });
  }
}
