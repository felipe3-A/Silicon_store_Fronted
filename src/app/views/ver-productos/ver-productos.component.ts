import { Component, OnInit } from "@angular/core";
import { ProductService } from "app/services/product.service";
import { ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";
import { log } from "util";
@Component({
  selector: "ver-productos",
  templateUrl: "./ver-productos.component.html",
  styleUrls: ["./ver-productos.component.css"],
})
export class VerProductosComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  productosFiltradosPaginados: any[] = [];
  selectedFiles: { [key: number]: File[] } = {};
  galeriaActual: any = null;
  mostrarGaleriaModal: boolean = false;
  itemSeleccionado: any;

  busqueda: string = "";
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  galeriaImagenes: string[] = [];

  constructor(
    private serviceImages: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    Swal.fire({
      title: "Cargando productos...",
      html: "Por favor espera",
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    });

    this.serviceImages.listarProductos().subscribe({
      next: (productos: any[]) => {
        this.productos = productos.filter(
          (p) => p.deleted === 0 && p.total_quantity > 0
        );
        this.productos.forEach((p) => {
          p.imagen = p.pic_filename
            ? `https://pos.silicon.com.co/items/pic_thumb/${p.pic_filename}`
            : "assets/img/404.png";
        });

        this.filtrarProductos();
        Swal.close(); // Cierra el loading una vez finaliza
      },
      error: (err) => {
        Swal.close();
        console.error("❌ Error al listar productos:", err);
        Swal.fire("Error", "No se pudieron cargar los productos.", "error");
      },
    });
  }

  filtrarProductos() {
    const termino = this.busqueda.toLowerCase();
    this.productosFiltrados = this.productos.filter(
      (p) =>
        p.name.toLowerCase().includes(termino) ||
        String(p.item_id).includes(termino)
    );
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  actualizarPaginacion() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.productosFiltradosPaginados = this.productosFiltrados.slice(
      inicio,
      fin
    );
  }

  get totalPaginas(): number {
    return Math.ceil(this.productosFiltrados.length / this.itemsPorPagina);
  }

  get totalPaginasArray(): number[] {
    return Array(this.totalPaginas)
      .fill(0)
      .map((_, i) => i + 1);
  }

  onFileSelected(event: any, itemId: number) {
    this.selectedFiles[itemId] = Array.from(event.target.files);
  }

  cargarGaleriaImagenes(item_id: number): void {
    Swal.fire({
      title: "Cargando galería...",
      text: "Estamos obteniendo las imágenes adicionales.",
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.serviceImages.obtenerGaleriaPorItemId(item_id).subscribe(
      (response) => {
        const imagenes =
          response.imagenes_adicionales?.map(
            (ruta: string) => `http://localhost:8000/storage/${ruta}`
          ) || [];

        this.galeriaImagenes = [...imagenes];

        Swal.close();
        const item = this.productos.find((p) => p.item_id === item_id);
        this.abrirModalGaleria(item);
      },
      (error) => {
        Swal.close();
        console.error("Error al cargar galería de imágenes:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al cargar las imágenes, por favor intenta de nuevo.",
          icon: "error",
          confirmButtonText: "Cerrar",
        });
      }
    );
  }

  abrirModalGaleria(item: any): void {
    if (!item || !item.item_id) {
      console.error("❌ El item no es válido para mostrar la galería:", item);
      return;
    }
    this.galeriaActual = item;
    this.mostrarGaleriaModal = true;
  }
  

  cerrarModalGaleria() {
    this.galeriaActual = null;
    this.mostrarGaleriaModal = false;
  }

  upload(itemId: number) {
    const files = this.selectedFiles[itemId];
    if (!files || files.length === 0) {
      Swal.fire("Advertencia", "Por favor selecciona imágenes.", "warning");
      return;
    }
  
    const base64Promises = files.map((file) => this.convertToBase64(file));
  
    Swal.fire({
      title: "Subiendo imágenes...",
      html: "Esto puede tardar un momento.",
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  
    Promise.all(base64Promises)
      .then((base64Images: string[]) => {
        const payload = {
          item_id: itemId,
          images: base64Images,
        };
  
        this.serviceImages.uploadImagesAsJson(payload).subscribe({
          next: (res) => {
            Swal.close();
            Swal.fire("Éxito", "Imágenes subidas correctamente.", "success");
            this.selectedFiles[itemId] = [];
  
            // ✅ Recargar la galería visible si el modal está abierto
            if (this.galeriaActual?.item_id === itemId) {
              this.cargarGaleriaImagenes(itemId);
            }
          },
          error: (error) => {
            Swal.close();
            Swal.fire("Error", "Hubo un error al subir las imágenes.", "error");
          },
        });
      })
      .catch((error) => {
        Swal.close();
        Swal.fire("Error", "No se pudieron convertir las imágenes.", "error");
      });
  }
  

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPaginacion();
    }
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPaginacion();
    }
  }

  irAPagina(pagina: number) {
    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }
  gestionarGaleria(item: any) {
    this.itemSeleccionado = item; // ✅ Establece el item seleccionado
  
    const imagenesHtml = item.gallery
      .map(
        (img: string, index: number) => `
      <div style="display: inline-block; margin: 5px; text-align: center;">
        <img src="http://localhost:8082/item_gallery/${img}" width="80" style="display:block;"/>
        <button onclick="window.eliminarImagen(${index})" class="btn btn-sm btn-danger mt-1">Eliminar</button>
      </div>
    `
      )
      .join("");
  
    Swal.fire({
      title: `Galería de ${item.name}`,
      html: `<div style="max-height:300px; overflow:auto;">${imagenesHtml}</div>`,
      showCloseButton: true,
      showConfirmButton: false,
      width: 600,
      didOpen: () => {
        // ✅ Expone la función global con solo la posición (el item ya está guardado)
        (window as any).eliminarImagen = (posicion: number) => {
          this.eliminarImagenSeleccionada(posicion,item);
        };
      },
    });
  }
  

  eliminarImagenSeleccionada(posicion: number, itemId: number): void {
    if (itemId === undefined || posicion === undefined) {
      console.error("Faltan datos para eliminar imagen", { itemId, posicion });
      Swal.fire({
        icon: "error",
        title: "Datos incompletos",
        text: "No se encontró el ID del producto o la posición de la imagen.",
      });
      return;
    }
    console.log("Producto seleccionado -->", itemId, "posición de la imagen:", posicion);
  
    // Mostrar carga
    Swal.fire({
      title: "Eliminando imagen...",
      html: "Por favor espera un momento.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    this.serviceImages.eliminarImagen(itemId, posicion).subscribe(
      (respuesta) => {
        console.log("✅ Imagen eliminada:", respuesta);
        this.galeriaImagenes.splice(posicion, 1);
  
        // Cerrar Swal y mostrar éxito
        Swal.close(); // Cierra el loading si aún está abierto
        Swal.fire({
          icon: "success",
          title: "Imagen eliminada",
          text: "La imagen se eliminó correctamente.",
          timer: 1500,
          showConfirmButton: false,
        });
      },
      (error) => {
        console.error("❌ Error al eliminar imagen:", error);
  
        Swal.close(); // Cierra el loading si aún está abierto
        Swal.fire({
          icon: "error",
          title: "Error al eliminar",
          text: "Ocurrió un problema al eliminar la imagen.",
        });
      }
    );
  }
  
  

  reemplazarImagenSeleccionada(posicion: number, event: any): void {
    const archivo = event.target.files[0];
    if (!archivo) return;

    this.serviceImages
      .reemplazarImagen(this.itemSeleccionado.item_id, posicion - 1, archivo)
      .subscribe(
        (response) => {
          this.cargarGaleriaImagenes(this.itemSeleccionado.item_id); // Recargar galería
        },
        (error) => {
          console.error("Error al reemplazar imagen:", error);
        }
      );
  }
  fetchGalleryImages(itemId: number) {
    this.serviceImages.getGalleryByItemId(itemId).subscribe({
      next: (res) => {
        this.galeriaImagenes[itemId] = res.images; // o como manejes la galería en tu HTML
      },
      error: (error) => {
        console.error("Error al obtener galería:", error);
      },
    });
  }
}
