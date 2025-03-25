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
    nombre_producto: "",
    descripcion_producto: "",

    precio_producto: "",
    imagen: null, // Cambiar de string a null
  };

  
  constructor(
    private fb: FormBuilder,
    private cartProductService: CartProductsService,
    private productService: ProductService,
    private router: Router,
    private cartService: CartServiceService,
    private publicidadService: PublicidadServiceService,
    private marcaService: MarcasServiceService,
    private grupoService: GrupoServiceService,
    private serviceCategoria: CategoriaServiceService,
    private authService: LoginService
  ) {}

  ngOnInit(): void {
    // Llamar a la función para listar productos al cargar el componente
    this.listarProductos();

    this.productoForm = this.fb.group({
      nombre: ["", Validators.required],
      descripcion: ["", Validators.required],
      precio: ["", [Validators.required, Validators.min(0)]],
    });

    this.obtenerImagenesPorTipo("1"); // Asegúrate de pasar el idTipo correcto
    this.obtenerIamgenesOfertas("2");
    this.obtenerImagenesDescuentos("3");
    this.listarMarcas();
    this.obtenerCategorias();
    this.listarGrupos();
  }

  // Método para redirigir a la vista de detalles
  verDetalles(imagen: any): void {
    let id_imagen = imagen.id_imagen || imagen.id_categoria || imagen.id_grupo;
  
    if (id_imagen) {
      console.log("ID de la imagen:", id_imagen); // Verifica que el ID no sea null
  
      // Verifica qué tipo de ID es y llama al servicio correspondiente
      if (imagen.id_imagen) {
        this.productService.listarProductoId(id_imagen).subscribe(
          (response) => {
            // Maneja la respuesta para mostrar la imagen
            console.log("Detalles de la imagen:", response);
            // Redirige a la vista de detalles pasando el ID
            this.router.navigate(['/detalles', id_imagen]);
          },
          (error) => {
            console.error("Error al obtener los detalles de la imagen", error);
          }
        );
      } else if (imagen.id_categoria) {
        this.productService.listarProductosPorCategoria(imagen.id_categoria).subscribe(
          (response) => {
            // Maneja la respuesta para mostrar los productos de la categoría
            console.log("Productos de la categoría:", response);
            // Redirige a la vista de productos de la categoría
            this.router.navigate(['/categoria', imagen.id_categoria]);
          },
          (error) => {
            console.error("Error al obtener los productos de la categoría", error);
          }
        );
      } else if (imagen.id_grupo) {
        this.productService.listarProductosPorGrupo(imagen.id_grupo).subscribe(
          (response) => {
            // Maneja la respuesta para mostrar los productos del grupo
            console.log("Productos del grupo:", response);
            // Redirige a la vista de productos del grupo
            this.router.navigate(['/grupo', imagen.id_grupo]);
          },
          (error) => {
            console.error("Error al obtener los productos del grupo", error);
          }
        );
      }
    } else {
      console.error("No se encontró un ID válido para la imagen.");
    }
  }

  // Método para navegar a la categoría específica
  // Método para navegar a las categorías del grupo
  navigateToCategoryforGroups(id_grupo: number[]): void {
    console.log("Navegando a el grupo con IDs:", id_grupo);
    this.router.navigate(["/groups", id_grupo]); // Pasar las categorías como un objeto
  }



  listarGrupos(): void {
    this.grupoService.listarGrupos().subscribe(
      (response) => {
        this.grupos = response.data.map((grupo) => {
          if (grupo.icono_grupo) {
            grupo.imagen = grupo.icono_grupo;
          }
          // Asegúrate de que 'categorias' sea un array
          if (!Array.isArray(grupo.categorias)) {
            grupo.categorias = [grupo.categorias]; // Convierte a array si no lo es
          }
          return grupo;
        });
        console.log("Grupos:", this.grupos);
      },
      (error) => {
        console.error("Error al obtener los Grupos", error);
      }
    );
  }

  obtenerImagenesDescuentos(idTipo): void {
    this.publicidadService.listarImagenesPorTipo(idTipo).subscribe(
      (response) => {
        this.descuentos = response.data.map((pulicidadIm) => {
          if (pulicidadIm.url_imagen_publicitaria) {
            pulicidadIm.imagen = pulicidadIm.url_imagen_publicitaria;
          }

          return pulicidadIm;
        });

        console.log("Imágenes por tipo:", this.publicidad);
      },
      (error) => {
        Swal.fire("Error", "No se pudieron obtener las imágenes", "error");
        console.error("Error al obtener las imágenes por tipo:", error);
      }
    );
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

  obtenerCategorias(): void {
    this.serviceCategoria.listarCategorias().subscribe(
      (response) => {
        this.listCategorias = response.data.map((listcategorias) => {
          if (listcategorias.logo_categoria) {
            listcategorias.imagen = listcategorias.logo_categoria;
          }
          // Llama a listarProductosPorCategoria para cada categoría
          return listcategorias;
        });
        console.log("Categorias:", this.listCategorias);
        console.log("Productos por categoría:", this.productosPorCategoria);      },
      (error) => {
        Swal.fire("Error", "No se pudieron obtener las imágenes", "error");
        console.error("Error al obtener las imágenes por tipo:", error);
      }
    );
  }

  obtenerIamgenesOfertas(idTipo): void {
    this.publicidadService.listarImagenesPorTipo(idTipo).subscribe(
      (response) => {
        this.ofertas = response.data.map((pulicidadIm) => {
          if (pulicidadIm.url_imagen_publicitaria) {
            pulicidadIm.imagen = pulicidadIm.url_imagen_publicitaria;
          }

          return pulicidadIm;
        });

        console.log("Imágenes por tipo:", this.publicidad);
      },
      (error) => {
        Swal.fire("Error", "No se pudieron obtener las imágenes", "error");
        console.error("Error al obtener las imágenes por tipo:", error);
      }
    );
  }

  obtenerImagenesPorTipo(idTipo: string): void {
    this.publicidadService.listarImagenesPorTipo(idTipo).subscribe(
      (response) => {
        this.publicidad = response.data.map((pulicidadIm) => {
          if (pulicidadIm.url_imagen_publicitaria) {
            pulicidadIm.imagen = pulicidadIm.url_imagen_publicitaria;
          }

          return pulicidadIm;
        });

        console.log("Imágenes por tipo:", this.publicidad);
      },
      (error) => {
        Swal.fire("Error", "No se pudieron obtener las imágenes", "error");
        console.error("Error al obtener las imágenes por tipo:", error);
      }
    );
  }

  verMasInformacion(producto: any): void {
    console.log("Ver más información de:", producto);
    // Lógica para redirigir a una página de detalles del producto o mostrar más información
  }

  agregarAFavoritos(producto: any): void {
    console.log("Producto agregado a favoritos:", producto);
    // Lógica para agregar el producto a una lista de favoritos
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.ProductoData.imagen = file; // Asigna el archivo directamente
      console.log("Imagen cargada:", this.ProductoData.imagen);
    }
  }

  listarProductos(): void {
    this.productService.listarProductos().subscribe(
      (response) => {
        this.productos = response.data.map((producto) => {
          producto.imagen = producto.pic_filename ? producto.pic_filename : 'assets/img/404.png';
          return producto;
        });
      },
      (error) => {
        console.error("Error al obtener Productos", error);
      }
    );
  }
  

  listarProductosPorCategoria(id_categoria: number): void {
    this.productService.listarProductosPorCategoria(id_categoria).subscribe(
      (response) => {
        this.productosPorCategoria[id_categoria] = response.data; // Almacena los productos por categoría
        console.log("Productos por categoría:", this.productosPorCategoria[id_categoria]);
      },
      (error) => {
        Swal.fire("Error", "No se pudieron obtener los productos por categoría", "error");
        console.error("Error al obtener los productos por categoría:", error);
      }
    );
  }

  listarMarcas(): void {
    this.marcaService.listarMarcas().subscribe(
      (response) => {
        this.marcas = response.data.map((marca) => {
          if (marca.logo_marca) {
            marca.imagen = marca.logo_marca;
          }
          return marca;
        });
        console.log("MARCAS:", this.marcas);
      },
      (error) => {
        console.error("Error al obtener Productos", error);
      }
    );
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

  // En main.component.ts
  crearCarrito(producto: any): void {
    if (this.authService.isLoggedIn()) {
      const usuarioIdString = this.authService.getUserId(); // Obtén el ID del usuario logueado como string
      const usuarioId = Number(usuarioIdString); // Convierte el ID a un número
      console.log("Id obtenido del usuario Logueado:", usuarioId);

      // Primero, verifica si ya existe un carrito para el usuario
      this.cartService.obtenerCarrito(usuarioId).subscribe(
        (response) => {
          if (response && response.data) {
            // Si el carrito ya existe, agrega el producto
            this.carrito_id = response.data.id; // Guarda el ID del carrito
            this.agregarProductoAlCarrito(
              this.carrito_id,
              producto.id_imagen,
              1,
              producto.precio
            ); // Cambia aquí
          } else {
            // Si no existe, crea un nuevo carrito
            this.cartService.crearCarrito(usuarioId).subscribe(
              (createResponse) => {
                this.carrito_id = createResponse.data.id; // Guarda el ID del nuevo carrito
                this.agregarProductoAlCarrito(
                  this.carrito_id,
                  producto.id_imagen,
                  1,
                  producto.precio
                ); // Cambia aquí
              },
              (error) => {
                console.error("Error al crear el carrito", error);
                Swal.fire("Error", "No se pudo crear el carrito", "error");
              }
            );
          }
        },
        (error) => {
          console.error("Error al obtener el carrito", error);
          Swal.fire("Error", "No se pudo obtener el carrito", "error");
        }
      );
    } else {
      // Si no está logueado, redirige al login
      Swal.fire({
        icon: "warning",
        title: "¡Debes iniciar sesión!",
        text: "Por favor, inicia sesión para agregar productos al carrito.",
      }).then(() => {
        this.router.navigate(["/login"]); // Cambia a la ruta de login
      });
    }
  }

  agregarProductoAlCarrito(
    carrito_id: number,
    id_imagen: number,
    cantidad: number,
    precio: number
  ): void {
    const productoData = {
      carrito_id: carrito_id,
      id_imagen: id_imagen,
      cantidad: 1,
      precio: 10.0,
      addedAt: new Date().getTime(), // Agrega un timestamp
    };

    this.cartProductService.agregarProductoAlCarrito(productoData).subscribe(
      (response) => {
        Swal.fire("Éxito", "Producto agregado al carrito", "success");
      },
      (error) => {
        console.error("Error al agregar producto al carrito", error);
        Swal.fire(
          "Error",
          "No se pudo agregar el producto al carrito",
          "error"
        );
      }
    );
  }
}
