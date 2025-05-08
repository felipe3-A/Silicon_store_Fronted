import { Component, OnInit } from "@angular/core";
import { CartServiceService } from "app/services/Cart/cart-service.service";
import { CartProductsService } from "app/services/CartProduct/cart-product.service";
import { ProductService } from "app/services/product.service";
import { LoginService } from "app/services/usuarios/login-service.service";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";

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
  imagenPrincipal: string ="https://media.istockphoto.com/id/1152189152/es/vector/icono-rojo-de-alerta.jpg?s=612x612&w=0&k=20&c=FTX2cd49ZhiXXyR-mMXT4vb2jxuInJVx7fcTOtQV37U=";

  constructor(
    private cartProductsService: CartProductsService,
    private productosService: ProductService,
    private cartService: CartServiceService,
    private loginService: LoginService // Inyecta el servicio de login
  ) {}

  async ngOnInit(): Promise<void> {
    this.person_id = parseInt(this.loginService.getUserCarrito() ?? '0'); // Obtener el ID del usuario logueado desde el servicio LoginService
    if (this.person_id === 0) {
      console.warn("Usuario no logueado o ID no disponible.");
      console.log('Id encontrado:', this.person_id);
      
      return; // Si no hay un usuario logueado, no continuamos
    }

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
  
  
  getImagenProducto(producto: any): string {
    const filename = producto.product.pic_filename;
    return filename
      ? `http://localhost:8082/uploads/item_pics/${filename}`
      : 'assets/img/404.png'; // imagen por defecto
  }
  
listarProductos() {
  this.productosService.listarProductos().subscribe({
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

  verDetalleProducto(producto: any): void {
    // Lógica para mostrar los detalles del producto
    Swal.fire({
      title: producto.nombre_producto,
      text: producto.descripcion_producto,
      imageUrl: producto.pic_filename || "assets/img/404ERROR.png",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Producto",
    });
  }

  comprarUnidad(producto: any): void {
    // Lógica para redirigir a la pasarela de pagos con solo este producto
    this.initBoldCheckout();
    if (this.checkout) {
      const orderId = "PRODUCTO-" + producto.item_id + "-" + Date.now();
      const currency = "COP";

      this.checkout.orderId = orderId;
      this.checkout.open();

      this.checkout.on("complete", () => {
        this.mostrarFacturaEnModal(); // 👈 mostramos los detalles
        this.obtenerProductosEnCarrito(); // Refresca el carrito
      });
      
    }
  }

  descargarFactura(): void {
    if (this.carrito && this.carrito.length > 0) {
      const doc = new jsPDF();
  
      // Cargar imagen del logo
      const logo = new Image();
      logo.src = 'assets/img/Silicon_Store.png';
      logo.onload = () => {
        doc.addImage(logo, 'PNG', 80, 10, 40, 20); // Centrado
  
        // Encabezado de la empresa
        doc.setFontSize(14);
        doc.text('CENTRO DE SERVICIOS ISLICON', 105, 35, { align: 'center' });
        doc.setFontSize(11);
        doc.text('Factura generada por silicon.store', 105, 42, { align: 'center' });
  
        // Datos de la empresa
        doc.setFontSize(10);
        doc.text('NIT: 900123456-7', 14, 50);
        doc.text('Dirección: Calle 45 #12-34, Ciudad', 14, 55);
        doc.text('Teléfonos: (1) 234 5678 - 300 123 4567', 14, 60);
        doc.text('Correo: contacto@silicon.store', 14, 65);
  
        // Datos del cliente
        const usuario = this.loginService.getUserData();
        const nombre = usuario?.name || "Usuario";
        const correo = usuario?.email || "correo@desconocido.com";
  
        doc.setFontSize(12);
        doc.text('Datos del cliente:', 14, 75);
        doc.setFontSize(10);
        doc.text(`Nombre: ${nombre}`, 14, 80);
        doc.text(`Correo: ${correo}`, 14, 85);
  
        // Tabla de productos
        doc.setFontSize(12);
        doc.text('Productos:', 14, 95);
  
        doc.setFontSize(10);
        doc.text("Producto", 14, 100);
        doc.text("Cant.", 90, 100);
        doc.text("Precio", 120, 100);
        doc.text("Subtotal", 160, 100);
  
        let currentY = 105;
        this.carrito.forEach((producto, index) => {
          const nombreProducto = producto.product.name;
          const precio = parseFloat(producto.product.unit_price).toFixed(2);
          const cantidad = producto.product.receiving_quantity || 1;
          const subtotal = (parseFloat(precio) * cantidad).toFixed(2);
  
          doc.text(nombreProducto, 14, currentY);
          doc.text(cantidad.toString(), 90, currentY);
          doc.text(`$${precio}`, 120, currentY);
          doc.text(`$${subtotal}`, 160, currentY);
  
          currentY += 10;
  
          if (currentY > 270) {
            doc.addPage();
            currentY = 20;
          }
        });
  
        // Total de la compra
        const total = this.totalAmount.toFixed(2);
        doc.setFontSize(12);
        doc.text(`Total: $${total}`, 14, currentY + 10);
  
        // Mensaje de agradecimiento
        doc.setFontSize(11);
        doc.text("¡Gracias por tu compra! Esperamos verte pronto.", 14, currentY + 20);
  
        // Guardar PDF
        doc.save("FacturaCompra.pdf");
      };
    } else {
      console.warn("El carrito está vacío, no se puede generar la factura.");
    }
  }
  
  

  vaciarCarrito() {
    this.cartProductsService.vaciarCarrito(this.person_id).subscribe(() => {
      this.carrito = [];
      this.totalAmount = 0;
      console.log('Carrito vaciado correctamente');
    });
    
  }
  

  mostrarFacturaEnModal() {
    const usuario = this.loginService.getUserData(); // Asegúrate de tener estos datos del usuario
    const nombre = usuario?.nombre || "Usuario";
    const correo = usuario?.correo || "correo@desconocido.com";
  
    const productosHtml = this.carrito.map((producto) => {
      const nombreProd = producto.product.name;
      const precio = parseFloat(producto.product.unit_price).toFixed(2);
      const cantidad = producto.product.receiving_quantity || 1;
      const subtotal = (parseFloat(precio) * cantidad).toFixed(2);
  
      return `
        <tr>
          <td>${nombreProd}</td>
          <td>${cantidad}</td>
          <td>$${precio}</td>
          <td>$${subtotal}</td>
        </tr>
      `;
    }).join('');
  
    const htmlFactura = `
      <strong>Cliente:</strong> ${nombre}<br>
      <strong>Correo:</strong> ${correo}<br><br>
      <table style="width:100%; text-align:left; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px solid #ccc;">
            <th>Producto</th>
            <th>Cant.</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>${productosHtml}</tbody>
      </table>
      <br><strong>Total: </strong> $${this.totalAmount.toFixed(2)}
    `;
  
    Swal.fire({
      title: '🧾 Factura de compra',
      html: htmlFactura,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      width: 700,
    });
  }
  

  obtenerCarrito(): void {
    this.cartService.obtenerCarrito(this.person_id).subscribe(
      (response) => {
        console.log("Respuesta al obtener carrito:", response);

        if (response?.data) {
          console.log("Datos del carrito recibido:", response.data);

          if (response.data.id) {
            if (response.data.person_id !== this.person_id) {
              console.warn(`El carrito pertenece a otro usuario. Esperado: ${this.person_id}, Recibido: ${response.data.person_id}`);
              return;
            }

            this.carritoId = response.data.person_id;
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
          
          // Establecer la cantidad inicial en 1 para cada producto
          this.carrito.forEach(producto => {
            producto.product.receiving_quantity = 1; // Establecer la cantidad inicial en 1
          });
  
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
    const itemId = producto?.id; // Este es el ID correcto del ítem del carrito
  
    if (!itemId) {
      console.error("ID del item del carrito no definido:", producto);
      Swal.fire("Error", "No se encontró el ID del item del carrito para eliminar", "error");
      return;
    }
  
    this.cartProductsService.eliminarProductoDelCarrito(this.person_id, itemId).subscribe(
      (response) => {
        Swal.fire("Éxito", "Producto eliminado del carrito", "success");
        this.obtenerProductosEnCarrito(); // Refresca el carrito
      },
      (error) => {
        console.error("Error al eliminar producto del carrito", error);
        Swal.fire("Error", "No se pudo eliminar el producto del carrito", "error");
      }
    );
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

calcularTotal(): number {
  this.totalAmount = this.carrito.reduce((total, producto) => {
    let precio = parseFloat(producto.product.unit_price);
    const cantidad = producto.product.receiving_quantity || 1; // Usar la cantidad seleccionada

    if (isNaN(precio)) {
      precio = 0;
    }

    return total + precio * cantidad;
  }, 0);

  return Math.round(this.totalAmount);
}

actualizarCantidad(producto: any) {
  // Actualiza la cantidad en el carrito
  const nuevaCantidad = producto.product.receiving_quantity;
  producto.product.receiving_quantity = nuevaCantidad;

  // Recalcular el total del carrito
  this.calcularTotal();
}
}
  
  

