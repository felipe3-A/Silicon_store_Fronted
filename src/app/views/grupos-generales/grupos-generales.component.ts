import { Component, OnInit } from "@angular/core";
import { GrupoServiceService } from "app/services/Grupo/grupo-service.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { CategoriaServiceService } from "app/services/Categoria/categoria-service.service";

@Component({
  selector: "grupos-generales",
  templateUrl: "./grupos-generales.component.html",
  styleUrls: ["./grupos-generales.component.css"],
})
export class GruposGeneralesComponent implements OnInit {
  grupos = [];
  gruposForm: FormGroup;
  previsualizacion: string = "";
  archivos: any[] = [];
  tipos = [];
  categoriasSeleccionadas: number[] = []; // Para almacenar las categorías seleccionadas

  constructor(
    private grupoService: GrupoServiceService,
    private fb: FormBuilder,
    private categoriaService: CategoriaServiceService
  ) {}

  ngOnInit(): void {
    this.gruposForm = this.fb.group({
        nombre_grupo: ["", [Validators.required]],
        icono_grupo: ["", [Validators.required]], // Asegúrate de que este campo esté aquí
    });

    console.log("Estado inicial del formulario:", this.gruposForm.value);


    this.listarGrupos();
    this.obtenerCategorias(); // Llama a obtenerCategorias para cargar las categorías
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
  obtenerCategorias(): void {
    this.categoriaService.listarCategorias().subscribe(
      (response) => {
        console.log("Categorías Listadas:", response.data);
        this.tipos = response.data;
      },
      (error) => {
        console.log("No se pudieron listar las categorías", error);
      }
    );
  }

  crearGrupo(): void {
    // Log para verificar el estado del formulario
    console.log("Estado del formulario:", this.gruposForm.value);
    console.log("Categorías seleccionadas:", this.categoriasSeleccionadas);

    if (this.gruposForm.invalid || this.categoriasSeleccionadas.length === 0) {
        this.gruposForm.markAllAsTouched();
        console.log("Formulario inválido o no se seleccionaron categorías.");
        return;
    }

    const formData = new FormData();
    if (this.archivos.length > 0) {
        formData.append("icono_grupo", this.archivos[0]);
    }

    Object.keys(this.gruposForm.controls).forEach((key) => {
        const controlValue = this.gruposForm.get(key)?.value;
        console.log(`Valor de ${key}:`, controlValue); // Log para cada control
        if (controlValue !== undefined && controlValue !== "") {
            formData.append(key, controlValue);
        }
    });

    // Agregar las categorías seleccionadas al FormData
    this.categoriasSeleccionadas.forEach((id_categoria) => {
        formData.append("id_categorias[]", id_categoria.toString());
    });

    this.grupoService.crearGrupos(formData).subscribe({
        next: () => {
            Swal.fire("Éxito", "Grupo creado correctamente", "success");
            this.listarGrupos();
            this.gruposForm.reset();
            this.archivos = [];
            this.previsualizacion = "";
            this.categoriasSeleccionadas = []; // Reiniciar las categorías seleccionadas
        },
        error: () => Swal.fire("Error", "No se pudo crear el Grupo", "error"),
    });
}


seleccionarCategoria(id_categoria: number, event: any): void {
  console.log(`Checkbox para categoría ${id_categoria} está ${event.target.checked ? 'seleccionado' : 'no seleccionado'}`);
  if (event.target.checked) {
      this.categoriasSeleccionadas.push(id_categoria);
  } else {
      this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(
          (id) => id !== id_categoria
      );
  }
  console.log("Categorías seleccionadas actuales:", this.categoriasSeleccionadas);
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
      this.archivos.push(archivo);
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

  eliminarGrupo(id_grupo: number): void {
    Swal.fire({
      title: "¿Seguro que quieres borrar este Grupo permanentemente?",
      text: "No se puede volver a recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, estoy seguro",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.grupoService.eliminarGrupo(id_grupo).subscribe(
          () => {
            Swal.fire("¡Éxito!", "Grupo Eliminado exitosamente", "success");
            this.listarGrupos();
          },
          () => Swal.fire("¡Error!", "El Grupo no se pudo borrar", "error")
        );
      }
    });
  }
}
