import { Component, OnInit } from '@angular/core';
import { MarcasServiceService } from 'app/services/Marcas/marcas-service.service';
import { response } from 'express';

@Component({
  selector: 'nuestras-marcas',
  templateUrl: './nuestras-marcas.component.html',
  styleUrls: ['./nuestras-marcas.component.css']
})
export class NuestrasMarcasComponent implements OnInit {

  marcas: [];

  constructor(    private marcaService: MarcasServiceService,
  ) { }

  ngOnInit(): void {
    this.listarMarcas();

  }
   listarMarcas():void{
    this.marcaService.listarMarcas().subscribe(
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
        console.error("Error al obtener Productos", error);
      }
    );
   }

}
