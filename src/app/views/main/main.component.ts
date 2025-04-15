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

@Component({
  selector: "main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"],
})
export class MainComponent implements OnInit {
  productos = [];
  marcas: [];
  publicidad = [];
  productXcategorias = [];
  ofertas = [];
  descuentos = [];
  promociones = [];
  categoriasForm = [];
  grupos = [];
  // Listar las categorias
  categorias: any[] = [];

  listCategorias :any[]=[]
  productosPorCategoria: { [key: number]: any[] } = {}; // Para almacenar productos por categoría

    carrito_id: number | null = null; // Para almacenar el ID del carrito

    userId: string | null = null;

  //Aqui se guardaran los productos sin embargo no las esta listando
  //Ya que esto devuelve un array vacio
  carrito: any[] = [];

  productoForm: FormGroup;
  carritoForm: FormGroup;

  cart = [];
  ProductoData = {
    people_id: this.userId,
    item_id: null,  // Replace with the correct item ID
    cantidad: 1,    // Default quantity or dynamic based on the UI
    precio: null,   // Replace with the correct price
    addedAt: Date.now(),  // Example to set the current timestamp
  };
  ;

  
  constructor(
    private fb: FormBuilder,
    private cartProductService: CartProductsService,
    private productService: ProductService,
    private router: Router,
    private publicidadService: PublicidadServiceService,
    private authService: LoginService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
  
    if (this.userId) {
      this.authService.obtenerCarritoId(+this.userId).subscribe({
        next: (data) => {
          this.carrito_id = data.carrito_id;
          console.log('🛒 ID del carrito obtenido:', this.carrito_id);
        },
        error: (err) => {
          console.error('❌ Error al obtener el carrito del usuario:', err);
        }
      });
    }
  
    this.listarProductos();
    this.obtenerPublicidad();
  
    this.productoForm = this.fb.group({
      nombre: ["", Validators.required],
      descripcion: ["", Validators.required],
      precio: ["", [Validators.required, Validators.min(0)]],
    });
  }
  
  
  
  obtenerPublicidad() {
    this.publicidadService.listarPublicidad().subscribe({
      next: (data) => {
        console.log('Imágenes de publicidad:', data);
        this.publicidad = data.map((imagen: any) => ({
          ...imagen,
          image_url: `http://127.0.0.1:8000/storage/${imagen.image_url}`
        }));
      },
      error: (error) => {
        console.error('Error al obtener la publicidad:', error);
      }
    });
  }
  

  // Método para redirigir a la vista de detalles
  // verDetalles(imagen: any): void {
  //   let id_imagen = imagen.id_imagen || imagen.id_categoria || imagen.id_grupo;
  
  //   if (id_imagen) {
  //     console.log("ID de la imagen:", id_imagen); // Verifica que el ID no sea null
  
  //     // Verifica qué tipo de ID es y llama al servicio correspondiente
  //     if (imagen.id_imagen) {
  //       this.productService.listarProductoId(id_imagen).subscribe(
  //         (response) => {
  //           // Maneja la respuesta para mostrar la imagen
  //           console.log("Detalles de la imagen:", response);
  //           // Redirige a la vista de detalles pasando el ID
  //           this.router.navigate(['/detalles', id_imagen]);
  //         },
  //         (error) => {
  //           console.error("Error al obtener los detalles de la imagen", error);
  //         }
  //       );
  //     } else if (imagen.id_categoria) {
  //       this.productService.listarProductosPorCategoria(imagen.id_categoria).subscribe(
  //         (response) => {
  //           // Maneja la respuesta para mostrar los productos de la categoría
  //           console.log("Productos de la categoría:", response);
  //           // Redirige a la vista de productos de la categoría
  //           this.router.navigate(['/categoria', imagen.id_categoria]);
  //         },
  //         (error) => {
  //           console.error("Error al obtener los productos de la categoría", error);
  //         }
  //       );
  //     } else if (imagen.id_grupo) {
  //       this.productService.listarProductosPorGrupo(imagen.id_grupo).subscribe(
  //         (response) => {
  //           // Maneja la respuesta para mostrar los productos del grupo
  //           console.log("Productos del grupo:", response);
  //           // Redirige a la vista de productos del grupo
  //           this.router.navigate(['/grupo', imagen.id_grupo]);
  //         },
  //         (error) => {
  //           console.error("Error al obtener los productos del grupo", error);
  //         }
  //       );
  //     }
  //   } else {
  //     console.error("No se encontró un ID válido para la imagen.");
  //   }
  // }

  verProducto(item_id: number) {
    this.router.navigate(['/producto', item_id]);
  }

  // Método para navegar a la categoría específica
  // Método para navegar a las categorías del grupo
  navigateToCategoryforGroups(id_grupo: number[]): void {
    console.log("Navegando a el grupo con IDs:", id_grupo);
    this.router.navigate(["/groups", id_grupo]); // Pasar las categorías como un objeto
  }



  

  


  // Método para navegar a la categoría específica
  navigateToCategory(id_categoria: number): void {
    console.log("Navegando a la categoría con ID:", id_categoria);
    this.router.navigate(["/products", id_categoria]);
  }

  // Método para navegar a la categoría específica
  navigateToCategoryandProduct(id_imagen: number): void {
    console.log("Navegando el producto con ID:", id_imagen);
    this.router.navigate(["/product", id_imagen]);
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
        this.productos = productos.filter(p => p.deleted === 0 && p.total_quantity > 0);
  
        // Asignar la URL de la imagen para cada producto
        this.productos.forEach(producto => {
          producto.imagen = producto.pic_filename 
            ? `http://localhost:8082/uploads/item_pics/${producto.pic_filename}` 
            : 'assets/img/404.png';
        });
  
        console.log('📦 Productos cargados:', this.productos);
      },
      error: (err) => {
        console.error('❌ Error al listar productos:', err);
      }
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
        icon: 'warning',
        title: '¡Atención!',
        text: 'Usuario no logueado. Por favor inicia sesión.',
        confirmButtonText: 'Cerrar'
      });
      return;
    }
  
    // Ya no necesitas obtener el carrito_id si no es parte del backend
    const productoData = {
      person_id: Number(idUsuario),
      item_id: producto.item_id,
      quantity: 1
    };
  
    Swal.fire({
      icon: 'info',
      title: 'Enviando al backend...',
      text: 'Por favor espera mientras procesamos tu solicitud.',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    this.cartProductService.agregarProductoAlCarrito(productoData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: '¡Producto agregado al carrito!',
          text: 'El producto se ha agregado correctamente.',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al agregar el producto al carrito. Intenta nuevamente.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }
  
  
  
  
  
}
