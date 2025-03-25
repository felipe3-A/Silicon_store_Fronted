import { Component, OnInit } from "@angular/core";
import { CartServiceService } from "app/services/Cart/cart-service.service";
import { CartProductsService } from "app/services/CartProduct/cart-product.service";
import { ProductService } from "app/services/product.service";
import { LoginService } from "app/services/usuarios/login-service.service";
import Swal from "sweetalert2";

declare var BoldCheckout: any; // Declaración de la variable

@Component({
  selector: "cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit {
  carrito: any[] = [];
  carritoId: number;

  productos: any[] = [];
  usuarioId: number; // Asegúrate de tener el ID del usuario logueado
  checkout: any; // Para almacenar la instancia de BoldCheckout
  mensajeCompraCompleta: boolean = false;
  cantidades: number[] = [1, 2, 3, 4, 5]; // Cantidades disponibles
  totalAmount: number = 0; // Aquí almacenamos el total calculado
  isLoggedIn: boolean = false; // Estado de inicio de sesión

  constructor(
    private cartProductsService: CartProductsService,
    private productosService: ProductService,
    private cartService: CartServiceService,
    private loginService: LoginService // Inyecta el servicio de login
  ) {}

  async ngOnInit(): Promise<void> {
    this.usuarioId = 1; // Asignar siempre el usuario con ID 1
    this.carritoId = 1; // Asegurar que tenga un carrito asignado
  
    this.listarProductos();
  
    try {
      await this.obtenerProductosEnCarrito(); // Espera a obtener los productos
      this.calcularTotal(); // Calcula el total correctamente
  
      if (this.totalAmount > 0) {
        await this.initBoldCheckout(); // Inicializa BoldCheckout solo si hay total
      } else {
        console.warn("No se inicializó BoldCheckout porque el total es 0.");
      }
    } catch (error) {
      console.error("Error al obtener productos del carrito:", error);
    }
  }
  
  
  
  calcularTotal(): number {
    this.totalAmount = this.carrito.reduce((total, producto) => {
      let precio = producto.precio_producto;
      const cantidad = producto.cantidad || 1;
  
      // Asegurar que el precio sea un número
      if (typeof precio === "string") {
        precio = parseFloat(precio.replace(",", "")) || 0;
      } else if (typeof precio !== "number" || isNaN(precio)) {
        precio = 0;
      }
  
      console.log(`Producto: ${producto.nombre_producto}, Precio: ${precio}, Cantidad: ${cantidad}, Subtotal: ${precio * cantidad}`);
      return total + (precio * cantidad);
    }, 0);
  
    // Convertir el total a entero redondeado
    this.totalAmount = Math.round(this.totalAmount);
    console.log("Total calculado (entero):", this.totalAmount);
    return this.totalAmount;
  }
  
  
  

  listarProductos(): void {
    this.productosService.listarProductos().subscribe(
      (response) => {
        this.productos = response.data.map((producto) => {
          if (producto.url_imagen) {
            producto.imagen = producto.url_imagen;
          }
          return producto;
        });
        console.log("Productos del Carrito:", this.productos);
      },
      (error) => console.error("Error al obtener Productos", error)
    );
  }

  verDetalleProducto(producto: any): void {
    // Lógica para mostrar los detalles del producto
    Swal.fire({
      title: producto.nombre_producto,
      text: producto.descripcion_producto,
      imageUrl: producto.url_imagen || "assets/img/404ERROR.png",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Producto",
    });
  }

  comprarUnidad(producto: any): void {
    // Lógica para redirigir a la pasarela de pagos con solo este producto
    this.initBoldCheckout();
    if (this.checkout) {
      const orderId = "PRODUCTO-" + producto.id_imagen + "-" + Date.now();
      const currency = "COP";

      this.checkout.orderId = orderId;
      this.checkout.open();

      this.checkout.on("complete", () => {
        Swal.fire("Éxito", "Compra realizada exitosamente", "success");
        this.obtenerProductosEnCarrito(); // Refresca el carrito si es necesario
      });
    }
  }

  obtenerCarrito(): void {
    this.cartService.obtenerCarrito(this.usuarioId).subscribe(
      (response) => {
        if (response && response.data) {
          this.carritoId = response.data.id; // Guarda el ID del carrito
          console.log("Carrito ID obtenido:", this.carritoId); // Verifica el ID del carrito)

          this.obtenerProductosEnCarrito(); // Llama a la función para obtener los productos en el carrito
        } else {
          console.error("No se encontró el carrito para el usuario.");
        }
      },
      (error) => {
        console.error("Error al obtener el carrito", error);
        Swal.fire("Error", "No se pudo obtener el carrito", "error");
      }
    );
  }

  obtenerProductosEnCarrito(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cartProductsService.obtenerProductosEnCarrito(this.carritoId).subscribe(
        (response) => {
          this.carrito = response.data.map((producto) => ({
            ...producto,
            precio_producto: producto.precio_producto || 1,
          }));
          console.log("Productos cargados en el carrito:", this.carrito);
          this.calcularTotal();
          resolve();
        },
        (error) => {
          console.error("Error al obtener productos del carrito", error);
          reject(error);
        }
      );
    });
  }
  

  eliminarProductoC(producto: any): void {
    this.cartProductsService
      .eliminarProductoDelCarrito(this.usuarioId, producto.id_imagen)
      .subscribe(
        (response) => {
          Swal.fire("Éxito", "Producto eliminado del carrito", "success");
          this.obtenerProductosEnCarrito(); // Actualiza la lista
        },
        (error) => {
          console.error("Error al eliminar producto del carrito", error);
          Swal.fire(
            "Error",
            "No se pudo eliminar el producto del carrito",
            "error"
          );
        }
      );
  }

  actualizarCantidad(producto: any) {
    console.log(
      `Cantidad actualizada para ${producto.nombre_producto}: ${producto.cantidad}`
    );

    // Recalcular el total del carrito
    this.calcularTotal();
  }

  iniciarPago(): void {
    console.log("Iniciando el proceso de pago...");
    if (this.checkout) {
      this.checkout.open();
    }
  }
  // Nueva función asincrónica para generar el hash SHA-256
  async generateIntegritySignature(
    orderId: string,
    amount: number,
    currency: string
  ): Promise<string> {
    const secretKey = "q8s-fXDRxrUC0cdpCJAKsA"; // Reemplaza con tu clave secreta
    const cadenaConcatenada = `${orderId}${amount}${currency}${secretKey}`;

    // Codificar la cadena en UTF-8
    const encodedText = new TextEncoder().encode(cadenaConcatenada);

    // Generar el hash SHA-256
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedText);

    // Convertir el buffer del hash en un array de bytes
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // Convertir cada byte en una representación hexadecimal y unirlos en una sola cadena
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  async initBoldCheckout(): Promise<void> {
    await this.obtenerProductosEnCarrito(); // Cargar productos
    this.calcularTotal(); // Recalcular total
  
    console.log("Carrito antes del cálculo:", this.carrito);
    console.log("TotalAmount antes de enviar a BoldCheckout:", this.totalAmount);
  
    if (!this.totalAmount || this.totalAmount <= 0) {
      console.error("Error: el total del carrito es inválido:", this.totalAmount);
      return;
    }
  
    const orderId = "MY-ORDER-" + Date.now();
    const currency = "COP";
    const totalAmountEnviar = this.totalAmount; // Usar directamente la variable
  
    console.log("Total enviado a BoldCheckout:", totalAmountEnviar);
  
    const integritySignature = await this.generateIntegritySignature(
      orderId,
      totalAmountEnviar,
      currency
    );
  
    this.checkout = new BoldCheckout({
      orderId: orderId,
      currency: currency,
      amount: totalAmountEnviar, // Asegurar que esta variable es correcta
      apiKey: "rAWnCUsKaJxYoFDXYjvMe7qukQHodJgC9ifkvIOHqTE",
      redirectionUrl: "http://localhost:4200/#/cart",
      description: "Pago de productos en mi tienda:",
      integritySignature: integritySignature,
    });
  
    console.log("Configuración de BoldCheckout:", this.checkout._config);
  }
  
  
  
  
}
