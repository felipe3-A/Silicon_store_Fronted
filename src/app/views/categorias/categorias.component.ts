import { Component, OnInit } from "@angular/core";
import { CategoriaServiceService } from "app/services/Categoria/categoria-service.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: "categorias",
  templateUrl: "./categorias.component.html",
  styleUrls: ["./categorias.component.css"],
})
export class CategoriasComponent implements OnInit {
  categorias = [];
  categoriaForm: FormGroup;
  archivos: any[] = [];
  previsualizacion: string="";

  constructor(
    private categoriaService: CategoriaServiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.categoriaForm = this.fb.group({
      categoria: ["", [Validators.required]],
      logo_categoria: ["", [Validators.required]]

    });
    this.listarCategorias();
  }

  // Método para crear una nueva categoría
  crearCategoria(): void {
      if (this.categoriaForm.invalid) {
        this.categoriaForm.markAllAsTouched();
        return;
      }
  
      const formData = new FormData();
      if (this.archivos.length > 0) {
        formData.append("logo_categoria", this.archivos[0]);
      }
  
      Object.keys(this.categoriaForm.controls).forEach((key) => {
        const controlValue = this.categoriaForm.get(key)?.value;
        console.log(key, controlValue); // Verifica que no esté siendo undefined
        if (controlValue === undefined || controlValue === "") {
          formData.append(key, null);
        } else {
          formData.append(key, controlValue); // Si el valor es undefined, agregar null
        }
      });
      this.categoriaService.crearCategorias(formData).subscribe({
        next: () => {
          Swal.fire("Éxito", "Marca creada correctamente", "success");
          this.listarCategorias();
          this.categoriaForm.reset();
          this.archivos = [];
          this.previsualizacion = "";
        },
        error: () => Swal.fire("Error", "No se pudo crear la Marca", "error"),
      });
    }
  

  // Método para listar todas las categorías
  
  listarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe(
      (response) => {
        this.categorias = response.data.map((categoria) => {
          if (categoria.logo_categoria) {
            categoria.imagen = categoria.logo_categoria;
          }
          return categoria;
        });
        console.log("Categorias:", this.categorias);
      },
      (error) => {
        console.error("Error al obtener Productos", error);
      }
    );
  }


  // Método para editar la categoría
  editarCategoria(index: number): void {
    this.categorias[index].editando = true; // Cambiar el estado de la categoría a "editando"
  }

  // Método para guardar los cambios realizados en la categoría
  guardarCambios(index: number): void {
    const categoriaEditada = this.categorias[index];
    console.log("Guardando cambios para la categoría:", categoriaEditada); // Verifica los datos que estás editando

    this.categoriaService
      .editarCategoria(categoriaEditada.id_categoria, {
        categoria: categoriaEditada.categoria,
      })
      .subscribe(
        (data) => {
          Swal.fire({
            title: "Acción Completada",
            text: "Categoria Actualizada Correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
          console.log("Categoría actualizada correctamente:", data);
          this.categorias[index].editando = false; // Detener el modo de edición
        },
        (error) => {
          console.error("Error al guardar cambios:", error);
        }
      );
  }

  // Método para eliminar una categoría
  deleteCategoria(id_categoria: number): void {
    Swal.fire({
      title: "¿Seguro que quieres borrar esta Categoria permanentemente?",
      text: "No se puede volver a recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, estoy seguro",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.eliminarCategoria(id_categoria).subscribe(
          () => {
            Swal.fire("¡Éxito!", "Categoria Eliminada exitosamente", "success");
            this.listarCategorias(); // Actualizamos la lista de usuarios
          },
          (error) => {
            Swal.fire("¡Error!", "La categoria no se pudo borrar", "error");
          }
        );
      }
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
}
