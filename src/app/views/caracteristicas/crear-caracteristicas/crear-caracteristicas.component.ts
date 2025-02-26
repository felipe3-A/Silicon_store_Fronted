import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CaracteristicasServicesService } from "app/services/caracteristicas/caracteristicas-services.service";
import { CategoriaServiceService } from "app/services/Categoria/categoria-service.service";
import Swal from "sweetalert2";
@Component({
  selector: "crear-caracteristicas",
  templateUrl: "./crear-caracteristicas.component.html",
  styleUrls: ["./crear-caracteristicas.component.css"],
})
export class CrearCaracteristicasComponent implements OnInit {
  constructor(
    private caracteristicasService: CaracteristicasServicesService,
    private fb: FormBuilder,
    private categoriaService: CategoriaServiceService
  ) {}

  caracteristicas: any = [];
  categoriasForm: any[] = []; // Cambiado a un array para almacenar las categorías

  caracteristicasForm: FormGroup;
  ngOnInit(): void {
    this.caracteristicasForm = this.fb.group({
      nombre_caracteristica: ["", [Validators.required]],
      id_categoria: ["", [Validators.required]],
    });

    this.listarCategorias()
  }

  listarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe(
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

  crearCaracteristica(): void {
    if (this.caracteristicasForm.invalid) {
      this.caracteristicasForm.markAllAsTouched();
      return;
    }
  
    const caracteristicaData = {
      nombre_caracteristica: this.caracteristicasForm.get("nombre_caracteristica")?.value,
      id_categoria: this.caracteristicasForm.get("id_categoria")?.value
    };
  
    console.log("Datos a enviar:", caracteristicaData); // Verifica el contenido de caracteristicaData
  
    this.caracteristicasService.createCaracteristica(caracteristicaData).subscribe({
      next: () => {
        Swal.fire("Éxito", "Característica creada correctamente", "success");
        this.caracteristicasForm.reset();
      },
      error: (err) => {
        console.error("Error al crear característica:", err);
        Swal.fire("Error", "No se pudo crear la Característica", "error");
      },
    });
  }
}
