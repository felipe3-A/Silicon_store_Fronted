import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PublicidadServiceService } from "app/services/Publicidad/publicidad-service.service";
import Swal from "sweetalert2";
import { TipoServiceService } from "app/services/Tipo/tipo-service.service";
import { CategoriaServiceService } from "app/services/Categoria/categoria-service.service";
import { GrupoServiceService } from "app/services/Grupo/grupo-service.service";
import { ProductService } from "app/services/product.service";

@Component({
  selector: "publicidad",
  templateUrl: "./publicidad.component.html",
  styleUrls: ["./publicidad.component.css"],
})
export class PublicidadComponent implements OnInit {
  publicidad = [];
  tipos = [];
  grupos = [];
  productos = [];
  categorias = [];

  // Validadores para escojer un solo id
  isCategoriaSelected: boolean = false;
  isGrupoSelected: boolean = false;
  isProductSelected: boolean = false;
  isTipoSelected: boolean = false;

  archivos: any[] = [];
  PublicidadForm: FormGroup;
  previsualizacion: string = "";

  constructor(
    private publicidadService: PublicidadServiceService,
    private fb: FormBuilder,
    private serviceTipo: TipoServiceService,
    private serviceCategoria: CategoriaServiceService,
    private serviceGrupo: GrupoServiceService,
    private serviceproduct: ProductService
  ) {}

  ngOnInit(): void {
    this.PublicidadForm = this.fb.group({
      url_imagen_publicitaria: ["", [Validators.required]],
      id_tipo_imagen: ["", [Validators.required]],
      nombre_imagen_publicitaria: ["", [Validators.required]],
      id_categoria: [""], // No obligatorio
      id_grupo: [""], // No obligatorio
      id_imagen: [""], // No obligatorio
    });

    this.obtenerImagenesPublicitarias();
    this.obtenerTiposdePublicidad();
    this.obtenerCategorias();
    this.obtenerGrupos();
    this.obtenerProductos();
  }

  onTipoChange(tipo: string): void {
    this.isCategoriaSelected = false;
    this.isGrupoSelected = false;
    this.isProductSelected = false;

    if (tipo === 'tipo') {
      this.isTipoSelected = true; // Si es necesario
    } else if (tipo === 'categoria') {
      this.isCategoriaSelected = true;
    } else if (tipo === 'grupo') {
      this.isGrupoSelected = true;
    } else if (tipo === 'producto') {
      this.isProductSelected = true;
    }
}

  obtenerTiposdePublicidad(): void {
    this.serviceTipo.listarTipos().subscribe(
      (response) => {
        this.tipos = response.data;
      },
      (error) => {
        console.error("No se pudieron listar los tipos", error);
      }
    );
  }

  obtenerCategorias(): void {
    this.serviceCategoria.listarCategorias().subscribe(
      (response) => {
        this.categorias = response.data;
      },
      (error) => {
        console.error("No se pudieron listar las Categorías", error);
      }
    );
  }

  obtenerGrupos(): void {
    this.serviceGrupo.listarGrupos().subscribe(
      (response) => {
        this.grupos = response.data;
      },
      (error) => {
        console.error("No se pudieron listar los grupos", error);
      }
    );
  }

  obtenerProductos(): void {
    this.serviceproduct.listarProductos().subscribe(
      (response) => {
        this.productos = response.data;
      },
      (error) => {
        console.error("No se pudieron listar los productos", error);
      }
    );
  }

  obtenerImagenesPublicitarias(): void {
    this.publicidadService.listarPublicidad().subscribe(
      (response) => {
        this.publicidad = response.data.map((publicidad) => {
          if (publicidad.url_imagen_publicitaria) {
            publicidad.imagen = publicidad.url_imagen_publicitaria;
          }
          return publicidad;
        });
      },
      (error) => {
        console.error("Error al obtener las Imagenes", error);
      }
    );
  }

  crearPublicidad(): void {
    if (this.PublicidadForm.invalid) {
      this.PublicidadForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    if (this.archivos.length > 0) {
      formData.append("url_imagen_publicitaria", this.archivos[0]);
    }

    const idTipoImagen = this.PublicidadForm.get('id_tipo_imagen')?.value;
    if (!idTipoImagen) {
      Swal.fire("Error", "El tipo de imagen es obligatorio", "error");
      return;
    }

    const idCategoria = this.PublicidadForm.get('id_categoria')?.value;
    const idGrupo = this.PublicidadForm.get('id_grupo')?.value;
    const idImagen = this.PublicidadForm.get('id_imagen')?.value;

    if (!idCategoria && !idGrupo && !idImagen) {
      Swal.fire("Error", "Debes seleccionar al menos una categoría, grupo o producto", "error");
      return;
    }

    formData.append("id_tipo_imagen", idTipoImagen);
    if (idCategoria) {
      formData.append("id_categoria", idCategoria);
    }
    if (idGrupo) {
      formData.append("id_grupo", idGrupo);
    }
    if (idImagen) {
      formData.append("id_imagen", idImagen);
    }

    this.publicidadService.crearPublicidad(formData).subscribe({
      next: () => {
        Swal.fire("Éxito", "Publicidad creada correctamente", "success");
        this.obtenerImagenesPublicitarias();
        this.PublicidadForm.reset();
        this.archivos = [];
        this.previsualizacion = "";
      },
      error: () => Swal.fire("Error", "No se pudo crear la Publicidad", "error"),
    });
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
        Swal.fire("Error", "El archivo debe ser una imagen (JPEG/PNG/JPG/AVIF/WEBP)", "error");
        return;
      }
      this.archivos.push(archivo);
      this.extraerBase64(archivo).then((imagen: any) => {
        this.previsualizacion = imagen.base || "";
      });
    }
  }

  extraerBase64 = async (file: File) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve({ base: reader.result });
      reader.onerror = () => resolve({ base: null });
    });

  eliminarImagenPublicitaria(id_imagen_publicitaria: number): void {
    Swal.fire({
      title: "¿Seguro que quieres borrar esta Imagen permanentemente?",
      text: "No se puede volver a recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, estoy seguro",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.publicidadService.eliminarPublicidad(id_imagen_publicitaria).subscribe(
          () => {
            Swal.fire("¡Éxito!", "Imagen eliminada exitosamente", "success");
            this.obtenerImagenesPublicitarias();
          },
          () => Swal.fire("¡Error!", "La imagen no se pudo borrar", "error")
        );
      }
    });
  }
}