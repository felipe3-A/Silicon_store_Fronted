import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { ProductService } from "app/services/product.service";
import { Router } from "@angular/router";
import { ChangeDetectorRef } from "@angular/core";
import Swal from "sweetalert2";
import { CategoriaServiceService } from "app/services/Categoria/categoria-service.service";
import { MarcasServiceService } from "app/services/Marcas/marcas-service.service";
import { response } from "express";
import { GrupoServiceService } from "app/services/Grupo/grupo-service.service";
import { data } from "jquery";
import { CaracteristicasServicesService } from "app/services/caracteristicas/caracteristicas-services.service";

@Component({
  selector: "admin-product",
  templateUrl: "./admin-product.component.html",
  styleUrls: ["./admin-product.component.css"],
})
export class AdminProductComponent implements OnInit {
  @ViewChild("modalContent") modalContent: ElementRef<any> | null = null;

  productos = [];
  galerias = [];
  productosFiltrados: any[] = [];
  galeriaForm: FormGroup;
  productForm: FormGroup;
  step: number = 1; // Para manejar los pasos

  productoSeleccionado: any = {};
  previsualizacion: string = "";
  archivos: any[] = [];
  terminoBusqueda: string = "";
  noResultados: boolean = false;
  currentPage: number = 1;
  imagenesGaleria: string[] = []; // Para almacenar las imágenes de la galería seleccionada

  mostrarModalEditar: boolean = false;
  idProductoAEditar: number | null = null;
  pageSize: number = 10;
  showModal: boolean = false; // Modal de ver
  categoriasForm = [];
  gruposForm = [];
  filteredGalerias: any[] = []; // Galerías filtradas
  selectedCaracteristicas: any[] = []; // Para almacenar las características seleccionadas

  marcasForm = [];
  grupos = [];
  loading: boolean = false; // Variable para controlar el estado de carga

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private serviceCategoria: CategoriaServiceService,
    private marcaService: MarcasServiceService,
    private grupoService: GrupoServiceService,
    private caracteristicaService : CaracteristicasServicesService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      referencia_producto: ["", [Validators.required]],
      envio_producto: ["", [Validators.required]],
      garantia_producto: ["", [Validators.required]],
      id_grupo: ["", [Validators.required]],
      id_categoria: ["", [Validators.required]],
      id_marca: ["", [Validators.required]],
      cantidad_producto: [
        "",
        [Validators.required, Validators.pattern(/^\d+$/)],
      ],
      nombre_producto: ["", [Validators.required]],
      descripcion_producto: ["", [Validators.required]],
      precio_producto: [
        "",
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
      url_imagen: ["", [Validators.required]],
      id_galeria: ["", [Validators.required]],
      estado_producto: ["",[Validators.required]]
    });

    this.listarProductos();
    this.listarCategorias();
    this.loadGalerias(); // Cargar galerías al iniciar

    this.listarMarcas();
    this.listarGrupos();
    this.listarGalerias();

    this.showModal = false;
    this.mostrarModalEditar = false;
  }


  onCategoriaChange(event: any): void {
    const idCategoriaSeleccionada = event.target.value;
    this.caracteristicaService.getCaracteristicaById(idCategoriaSeleccionada).subscribe((caracteristicas) => {
      this.selectedCaracteristicas = caracteristicas; // Asigna las características a la variable
    });
  }

  loadGalerias(): void {
    this.productService.listarTodasGalerias().subscribe((data) => {
      this.galerias = data; // Asigna la lista completa de galerías
      this.filteredGalerias = data; // Inicialmente, las galerías filtradas son todas
    });
  }

  onSearchChange(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredGalerias = this.galerias.filter(galeria =>
      galeria.titulo_grupo.toLowerCase().includes(searchTerm)
    );
  }
  listarMarcas(): void {
    this.marcaService.listarMarcas().subscribe(
      (response) => {
        console.log("MARCAS listadas", response.data);
        this.marcasForm = response.data;
      },
      (error) => {
        // Cambiado para que el manejo del error sea correcto
        console.log("No se pudieron listar las marcas", error);
      }
    );
  }
  listarGrupos(): void {
    this.grupoService.listarGrupos().subscribe(
      (response) => {
        console.log("Grupos listados", response.data);
        this.gruposForm = response.data;
      },
      (error) => {
        // Cambiado para que el manejo del error sea correcto
        console.log("No se pudieron listar los Grupos", error);
      }
    );
  }
  listarCategorias(): void {
    this.serviceCategoria.listarCategorias().subscribe(
      (response) => {
        console.log("Categorias Listadas:", response.data);
        this.categoriasForm = response.data;
      },
      (error) => {
        // Cambiado para que el manejo del error sea correcto
        console.log("No se pudieron listar las categorias", error);
      }
    );
  }
  listarProductos(): void {
    this.productService.listarProductos().subscribe(
      (response) => {
        console.log("Productos listados:", response.data);
        
        this.productos = response.data.map((producto) => {
          if (producto.url_imagen) {
            producto.imagen = producto.url_imagen;
          }
          return producto;
        });
        this.filtrarProductos();
      },
      (error) => {
        console.error("Error al obtener Productos", error);
      }
    );
  }

  listarGalerias(): void {
    this.productService.listarTodasGalerias().subscribe(
      (response) => {
        console.log("Respuesta de la API de galerías:", response); // Verifica la respuesta
        if (Array.isArray(response)) {
          // Verifica si la respuesta es un array
          this.galerias = response.map((galeria) => {
            console.log("Galeria:", galeria); // Verifica cada galería
            if (galeria.url_imagenes) {
              try {
                galeria.imagen = JSON.parse(galeria.url_imagenes); // Asegúrate de parsear el JSON
              } catch (error) {
                console.error("Error al parsear url_imagenes:", error);
                galeria.imagen = []; // Asigna un array vacío si hay un error
              }
            } else {
              galeria.imagen = []; // Asigna un array vacío si no hay imágenes
            }
            return galeria;
          });
        } else {
          console.error("La respuesta no contiene datos válidos", response);
        }
      },
      (error) => {
        console.log("No se listaron galerías", error);
      }
    );
  }

  onGaleriaChange(event: any): void {
    const idGaleriaSeleccionada = event.target.value;
    const galeriaSeleccionada = this.galerias.find(
      (g) => g.id_galeria == idGaleriaSeleccionada
    );

    if (galeriaSeleccionada) {
      this.imagenesGaleria = galeriaSeleccionada.imagen || []; // Asigna las imágenes de la galería seleccionada
      console.log("Galería seleccionada:", galeriaSeleccionada.titulo_grupo);
      console.log("Imágenes de la galería:", this.imagenesGaleria); // Verifica las URLs
    } else {
      console.error("No se encontró la galería seleccionada");
      this.imagenesGaleria = []; // Limpia las imágenes si no se encuentra la galería
    }
  }

  filtrarProductos(): void {
    if (this.terminoBusqueda.trim() !== "") {
      this.productosFiltrados = this.productos.filter((producto) =>
        [
          producto.referencia,
          producto.nombre,
          producto.descripcion,
          producto.precio.toString(),
        ].some((campo) =>
          campo?.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
        )
      );
      this.noResultados = this.productosFiltrados.length === 0;
    } else {
      this.productosFiltrados = [...this.productos];
    }
  }

  capturarFile(event: any): void {
    const archivo = event.target.files[0];
    if (archivo) {
        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/avif",
            "image/webp",
        ];
        if (!tiposPermitidos.includes(archivo.type)) {
            Swal.fire(
                "Error",
                "El archivo debe ser una imagen (JPEG/PNG/JPG/AVIF/WEBP)",
                "error"
            );
            return;
        }
        this.archivos.push(archivo); // Asegúrate de que el archivo se esté agregando
        this.extraerBase64(archivo).then((imagen: any) => {
            this.previsualizacion = imagen.base || "";
        });
    }
}

  extraerBase64 = async (file: File) =>
    new Promise((resolve) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve({ base: reader.result });
        reader.onerror = () => resolve({ base: null });
      } catch {
        resolve({ base: null });
      }
    });




    crearProducto(): void {
      if (this.productForm.valid) {
          const formData = new FormData();
          const datosPaso2 = this.productForm.value;
  
          // Asegúrate de incluir id_galeria y la imagen en el FormData
          Object.keys(datosPaso2).forEach((key) => {
              formData.append(key, datosPaso2[key]);
          });
  
          // Agrega el archivo de imagen al FormData
          if (this.archivos.length > 0) {
              formData.append('url_imagen', this.archivos[0]); // Asegúrate de que el nombre coincida con lo que espera el backend
          }
  
          this.productService.crearProducto(formData).subscribe(() => {
            Swal.fire(
              "!Producto Agregado¡",
              "Se Añadio un Productoa tu Stock",
              "success"
          );
              this.step = 1;
              this.archivos = [];
          }, (error) => {
              console.error("Error al crear el producto:", error);
              alert("Hubo un error al crear el producto. Verifica los campos.");
          });
      } else {
        Swal.fire(
          "!Revisa el formulario",
          "Faltan algunos campos por llenar",
          "question"
      );
      }
  }
  eliminarProducto(id_imagen: number): void {
    Swal.fire({
      title: "¿Seguro que quieres borrar este producto permanentemente?",
      text: "No se puede volver a recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, estoy seguro",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.eliminarProducto(id_imagen).subscribe(
          () => {
            Swal.fire("¡Éxito!", "Producto Eliminado exitosamente", "success");
            this.listarProductos();
          },
          () => Swal.fire("¡Accion Ilegal!", "El producto pertenece a un carrito", "warning")
        );
      }
    });
  }

  abrirModalVer(producto: any): void {
    console.log("Producto seleccionado:", producto); // Depuración
    this.productoSeleccionado = producto;
    this.showModal = true;
  }

  abrirModaEditar(producto: any): void {
    console.log("Producto seleccionado:", this.productoSeleccionado); // Depuración
    this.productoSeleccionado = producto;
    this.mostrarModalEditar = true;
  }
  closeModal(): void {
    this.mostrarModalEditar = false;
  }

  handleCloseModal(): void {
    this.closeModal();
  }

  actualizarproducto(): void {
    this.closeModal() // Llama al método para obtener las empresas nuevamente
  }

  pageChange(event: number): void {
    this.currentPage = event;
  }
}
