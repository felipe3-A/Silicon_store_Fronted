import { Component, OnInit } from "@angular/core";
import { TipoServiceService } from "app/services/Tipo/tipo-service.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { response } from "express";
import Swal from "sweetalert2";

@Component({
  selector: "tipo-producto",
  templateUrl: "./tipo-producto.component.html",
  styleUrls: ["./tipo-producto.component.css"],
})
export class TipoProductoComponent implements OnInit {
  tipos = [];
  TiposForm: FormGroup;

  constructor(
    private tipoService: TipoServiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.TiposForm = this.fb.group({
      tipo_imagen: ["", [Validators.required]],
    });
    this.listarTipos();
  }

  listarTipos(): void {
    this.tipoService.listarTipos().subscribe(
      (response) => {
        this.tipos = response.data.map((tipo) => ({
          ...tipo,
          editando: false, // Agregar propiedad editando
        }));
        console.log("Tipos de imagen Listados: ", this.tipos);
      },
      (error) => {
        console.error("Error al obtener Listas", error);
      }
    );
  }

  crearTipo(): void {
    if (this.TiposForm.invalid) {
      console.log("Formulario inválido:", this.TiposForm.errors);
      this.TiposForm.markAllAsTouched();
      return;
    }
  
    const tipoData = {
      tipo_imagen: this.TiposForm.get('tipo_imagen')?.value || null, // Obtén el valor del formulario
    };
  
    this.tipoService.crearTipos(tipoData).subscribe({
      next: () => {
        Swal.fire("Éxito", "Tipo creado correctamente", "success");
        this.listarTipos();
        this.TiposForm.reset();
      },
      error: () => Swal.fire("Error", "No se pudo crear el tipo", "error"),
    });
  }
  

  // Método para editar la Tipo
  editartipo(index: number): void {
    this.tipos[index].editando = true; // Cambiar el estado de la categoría a "editando"
  }

  // Método para guardar los cambios realizados en la categoría
  guardarCambios(index: number): void {
    const TipoEditado = this.tipos[index];
    this.tipoService
      .editarTipo(TipoEditado.id_tipo_imagen, {
        tipo_imagen: TipoEditado.tipo_imagen,
      })
      .subscribe(
        (data) => {
          Swal.fire({
            title: "Éxito",
            text: "Tipo de imagen actualizado correctamente",
            icon: "success",
          });
          this.tipos[index].editando = false;
        },
        (error) => {
          Swal.fire({
            title: "Error",
            text: "No se pudo actualizar el tipo",
            icon: "error",
          });
        }
      );
  }
  

  deleteTipo(id_tipo_imagen: number): void {
    Swal.fire({
      title: "¿Seguro que quieres borrar este ipo permanentemente?",
      text: "No se puede volver a recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, estoy seguro",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoService.eliminarTipo(id_tipo_imagen).subscribe(
          () => {
            Swal.fire("¡Éxito!", "Tipo Eliminado exitosamente", "success");
            this.listarTipos(); // Actualizamos la lista de usuarios
          },
          (error) => {
            Swal.fire("¡Error!", "La Tipo no se pudo borrar", "error");
          }
        );
      }
    });
  }
}
