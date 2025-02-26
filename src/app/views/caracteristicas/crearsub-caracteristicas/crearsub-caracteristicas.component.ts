import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CaracteristicasServicesService } from "app/services/caracteristicas/caracteristicas-services.service";
import { SubCaracteristicasServicesService } from "app/services/subcaracteristicas/sub-caracteristicas-services.service";
import Swal from "sweetalert2";
import { CaracteristicasResponse } from 'app/model/caracteristica.model';

@Component({
  selector: "crearsub-caracteristicas",
  templateUrl: "./crearsub-caracteristicas.component.html",
  styleUrls: ["./crearsub-caracteristicas.component.css"],
})
export class CrearsubCaracteristicasComponent implements OnInit {
  subcaracteristicaForm: FormGroup;
  caracteristicasForm: any[] = [];

  constructor(
    private subCaracteristicaService: SubCaracteristicasServicesService,
    private fb: FormBuilder,
    private caracteristicaService: CaracteristicasServicesService
  ) {}

  ngOnInit(): void {
    this.subcaracteristicaForm = this.fb.group({
      nombre_subcaracteristica: ["", [Validators.required]],
      id_caracteristica: ["", [Validators.required]],
    });

    this.listarCaracteristicas(); // Llama a listarCaracteristicas en ngOnInit
  }

  crearSubcaracteristica(): void {
    if (this.subcaracteristicaForm.invalid) {
      this.subcaracteristicaForm.markAllAsTouched();
      return;
    }

    const subcaracteristicasData = {
      nombre_subcaracteristica: this.subcaracteristicaForm.get("nombre_subcaracteristica")?.value,
      id_caracteristica: this.subcaracteristicaForm.get("id_caracteristica")?.value,
      imagen_subcaracteristica: this.subcaracteristicaForm.get("imagen_subcaracteristica")?.value
    };

    console.log("Datos a enviar", subcaracteristicasData);

    this.subCaracteristicaService.createSubcaracteristica(subcaracteristicasData).subscribe({
      next: () => {
        Swal.fire("Éxito", "SubCaracteristica creada correctamente", "success");
        this.subcaracteristicaForm.reset();
      },
      error: (err) => {
        console.error("Error al crear característica:", err);
        Swal.fire("Error", "No se pudo crear la Característica", "error");
      },
    });
  }

  listarCaracteristicas(): void {
    this.caracteristicaService.getAllCaracteristicas().subscribe(
      (response: CaracteristicasResponse) => {
        console.log("Caracteristicas Listadas:", response.data[0]); // Accede al primer elemento del array
        this.caracteristicasForm = response.data[0]; // Asigna el primer array de características
      },
      (error) => {
        console.log("No se pudieron listar las caracteristicas", error);
      }
    );
  }
}