import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CartServiceService } from "app/services/Cart/cart-service.service";
import { CartProductsService } from "app/services/CartProduct/cart-product.service";
import { ProductService } from "app/services/product.service";
import { LoginService } from "app/services/usuarios/login-service.service";
import Swal from "sweetalert2";

@Component({
  selector: "productos-grupos",
  templateUrl: "./productos-grupos.component.html",
  styleUrls: ["./productos-grupos.component.css"],
})
export class ProductosGruposComponent implements OnInit {
  productos = [];
  id_grupo: number;
  carrito_id: number | null = null; // Para almacenar el ID del carrito


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartProductService: CartServiceService,
    private authService: LoginService,
    private cartProductsService: CartProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el ID del grupo de la ruta
    this.route.paramMap.subscribe((params) => {
      this.id_grupo = +params.get("id_grupo"); // Obtener el ID del grupo
      this.listarProductosPorGrupo(this.id_grupo);
    });
  }

  listarProductosPorGrupo(id_grupo: number): void {
    // Lógica para obtener productos por grupo
    this.productService.listarProductosPorGrupo(id_grupo).subscribe(
      (response) => {
        this.productos = response.data; // Asegúrate de que la respuesta tenga la estructura correcta
        console.log("Productos del grupo:", this.productos);
      },
      (error) => {
        console.error("Error al obtener productos del grupo", error);
      }
    );
  }

  crearCarrito(producto: any): void {
    if (this.authService.isLoggedIn()) {
      const usuarioIdString = this.authService.getUserId(); // Obtén el ID del usuario logueado como string
      const usuarioId = Number(usuarioIdString); // Convierte el ID a un número
      console.log("Id obtenido del usuario Logueado:", usuarioId);

      // Primero, verifica si ya existe un carrito para el usuario
      this.cartProductService.obtenerCarrito(usuarioId).subscribe(
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
            this.cartProductService.crearCarrito(usuarioId).subscribe(
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

    this.cartProductsService.agregarProductoAlCarrito(productoData).subscribe(
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
