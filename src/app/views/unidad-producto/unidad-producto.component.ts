import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MarcasServiceService } from "app/services/Marcas/marcas-service.service";
import { ProductService } from "app/services/product.service";
import Swal from "sweetalert2";
import { LoginService } from "app/services/usuarios/login-service.service";
import { CartProductsService } from "app/services/CartProduct/cart-product.service";
@Component({
  selector: "unidad-producto",
  templateUrl: "./unidad-producto.component.html",
  styleUrls: ["./unidad-producto.component.css"],
})
export class UnidadProductoComponent implements OnInit {
  item_id!: number;
  logoMarca: string = ""; // URL del logo de la marca
  productoListado: any[] = [];
  productos = [];

  galeriaImagenes: string[] = [];
  itemSeleccionado: any;
  imagenPrincipal: string ="https://media.istockphoto.com/id/1152189152/es/vector/icono-rojo-de-alerta.jpg?s=612x612&w=0&k=20&c=FTX2cd49ZhiXXyR-mMXT4vb2jxuInJVx7fcTOtQV37U=";
  esFavorito: boolean = false;

  constructor(
    private serviceImagen: ProductService,
    private cartProductService: CartProductsService,
    private authService: LoginService,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("item_id");
    console.log("ID del producto desde la URL:", idParam); // 👈 LOG

    if (idParam) {
      this.item_id = +idParam;
      this.cargarItemSeleccionado(this.item_id);
    } else {
      console.error("No se encontró el parámetro item_id en la URL");
    }
    this.listarProductos();
  }

  listarProductos() {
    this.productService.listarProductos().subscribe({
      next: (productos: any[]) => {
        this.productos = productos.filter(
          (p) => p.deleted === 0 && p.total_quantity > 0
        );
  
        this.productos.forEach((producto) => {
          producto.imagen = producto.pic_filename
            ? `http://localhost:8082/uploads/item_pics/${producto.pic_filename}`
            : "assets/img/404.png";
  
          // 👇 Mostrar cantidad en consola
          console.log(`🟢 Producto: ${producto.name}, Cantidad total: ${producto.total_quantity}`);
        });
  
        console.log("📦 Productos cargados:", this.productos);
      },
      error: (err) => {
        console.error("❌ Error al listar productos:", err);
      },
    });
  }
  

  cambiarImagenPrincipal(index: number): void {
    this.imagenPrincipal = this.galeriaImagenes[index];
  }

  cargarItemSeleccionado(item_id: number): void {
    this.serviceImagen.listarProductoId(item_id).subscribe(
      (response) => {
        console.log("Respuesta recibida:", response);
        this.itemSeleccionado = response;

        // Construye la URL de la imagen
        const tieneImagen = this.itemSeleccionado.pic_filename;
        this.imagenPrincipal = tieneImagen
          ? `http://localhost:8082/uploads/item_pics/${this.itemSeleccionado.pic_filename}`
          : "assets/img/404.png"; // imagen por defecto

        // Si tienes una galería de imágenes, puedes cargarla aquí también
        this.galeriaImagenes = tieneImagen ? [this.imagenPrincipal] : [];
      },
      (error) => {
        console.error("Error al cargar item:", error);
      }
    );
  }

  // Componente
  agregarAlCarrito(producto: any): void {
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
  
    // ⚠️ Validar que haya unidades disponibles
    if (producto.total_quantity <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Producto sin stock",
        text: "Este producto no tiene unidades disponibles.",
        confirmButtonText: "Cerrar",
      });
      return;
    }
  
    const productoData = {
      item_id: producto.item_id,
      person_id: Number(idUsuario),
      quantity: 1,
    };
  
    console.log("Datos enviados al backend:", productoData);
    console.log("Id Person :", idUsuario);
  
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
        console.error("❌ Error del servidor:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err?.error?.message || "Hubo un problema al agregar el producto al carrito.",
          confirmButtonText: "Cerrar",
        });
      },
    });
  }
  

  marcarFavorito(): void {
    this.esFavorito = !this.esFavorito;
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: this.esFavorito ? "info" : "warning",
      title: this.esFavorito ? "Añadido a favoritos" : "Eliminado de favoritos",
      showConfirmButton: false,
      timer: 2000,
    });
  }
}
