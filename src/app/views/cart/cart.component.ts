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
  person_id: number; // Asegúrate de tener el ID del usuario logueado
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
    this.person_id = 1; 
    try {
      await this.obtenerCarrito();  
      await this.obtenerProductosEnCarrito();
      
      if (!this.carrito || this.carrito.length === 0) {
        console.warn("El carrito está vacío o no se pudo obtener.");
        return;
      }
  
      this.calcularTotal();
      
      if (this.totalAmount > 0) {
        await this.initBoldCheckout();
      } else {
        console.warn("No se inicializó BoldCheckout porque el total es 0.");
      }
    } catch (error) {
      console.error("Error en la inicialización del carrito:", error);
    }
  }
  
  
  
  
  
  calcularTotal(): number {
    if (!Array.isArray(this.carrito) || this.carrito.length === 0) {
        console.warn("El carrito está vacío o no es un array válido.");
        this.totalAmount = 0;
        return 0;
    }
    this.totalAmount = this.carrito.reduce((total, producto) => {
        let precio = parseFloat(producto.product.unit_price); // Acceder al precio correcto
        const cantidad = producto.quantity || 1; // Asegúrate de usar la cantidad correcta

        if (isNaN(precio)) {
            precio = 0;
        }

        return total + precio * cantidad;
    }, 0);

    this.totalAmount = Math.round(this.totalAmount);
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
    this.cartService.obtenerCarrito(this.person_id).subscribe(
      (response) => {
        console.log("Respuesta al obtener carrito:", response);
  
        if (response?.data) {
          console.log("Datos del carrito recibido:", response.data);
  
          if (response.data.id) {
            if (response.data.user_id !== this.person_id) {
              console.warn(`El carrito pertenece a otro usuario. Esperado: ${this.person_id}, Recibido: ${response.data.user_id}`);
              return;
            }
  
            this.carritoId = response.data.id;
            console.log("Carrito ID obtenido:", this.carritoId);
            this.obtenerProductosEnCarrito();
          } else {
            console.warn("No se encontró un carrito válido para este usuario.");
            this.carritoId = null;
          }
        } else {
          console.warn("Respuesta inválida del servidor.");
        }
      },
      (error) => {
        console.error("Error al obtener el carrito", error);
      }
    );
  }
  
  obtenerProductosEnCarrito(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!this.person_id) {
            console.warn("No hay un ID de persona válido para obtener productos.");
            resolve();
            return;
        }

        this.cartProductsService.obtenerProductosEnCarrito(this.person_id).subscribe(
            (response) => {
                console.log("Respuesta de la API:", response);
                
                // Asignar directamente la respuesta a carrito
                this.carrito = response; // No hay propiedad 'data', es un array directamente
                
                resolve();
            },
            (error) => {
                console.error("Error en la petición:", error);
                this.carrito = []; // Para evitar errores
                reject(error);
            }
        );
    });
}
  
  
  
  

  eliminarProductoC(producto: any): void {
    this.cartProductsService
      .eliminarProductoDelCarrito(this.person_id, producto.id_imagen)
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
    const secretKey = "q8s-fXDRxrUC0cdpCJAKsA"; // Reemplaza con tu llave de identidad
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
    const totalAmountEnviar = this.totalAmount;

    console.log("Total enviado a BoldCheckout:", totalAmountEnviar);

    const integritySignature = await this.generateIntegritySignature(
        orderId,
        totalAmountEnviar,
        currency
    );

    this.checkout = new BoldCheckout({
        orderId: orderId,
        currency: currency,
        amount: totalAmountEnviar,
        apiKey: "rAWnCUsKaJxYoFDXYjvMe7qukQHodJgC9ifkvIOHqTE", // Reemplázala con la clave real
        description: "Pago de productos en mi tienda",
        integritySignature: integritySignature,
        payer: {
            email: "pagador@hotmail.com",
            phone_number: "3100000000",
            document: {
                document_type: "CEDULA",
                document_number: "1010140000"
            }
        }
    });

    console.log("Configuración de BoldCheckout:", this.checkout._config);
}

  
  
  
}
