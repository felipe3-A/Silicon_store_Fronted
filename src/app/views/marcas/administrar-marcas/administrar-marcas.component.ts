// administrar-marcas.component.ts
import { Component, OnInit } from "@angular/core";
import { MarcasServiceService } from "app/services/Marcas/marcas-service.service";
import Swal from "sweetalert2";

@Component({
  selector: "administrar-marcas",
  templateUrl: "./administrar-marcas.component.html",
  styleUrls: ["./administrar-marcas.component.css"],
})
export class AdministrarMarcasComponent implements OnInit {
  marcas = [];

  constructor(private serviceMarcas: MarcasServiceService) {}

  ngOnInit(): void {
    this.listarMarcas();
  }

  listarMarcas(): void {
    this.serviceMarcas.listarMarcas().subscribe(
      (response) => {
        this.marcas = response.data.map((marca) => {
          if (marca.logo_marca) {
            marca.imagen = marca.logo_marca;
          }
          return marca;
        });
        console.log("MARCAS:", this.marcas);
      },
      (error) => {
        console.error("Error al obtener Marcas", error);
      }
    );
  }

//   eliminarMarca(id: number): void {
//     this.serviceMarcas.(id).subscribe(
//       () => {
//         Swal.fire("Éxito", "Marca eliminada correctamente", "success");
//         this.listarMarcas(); // Actualiza la lista después de eliminar
//       },
//       (error) => {
//         Swal.fire("Error", "No se pudo eliminar la Marca", "error");
//       }
//     );
//   }
// 
}