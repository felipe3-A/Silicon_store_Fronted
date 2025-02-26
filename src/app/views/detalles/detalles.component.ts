// detalles.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicidadServiceService } from 'app/services/Publicidad/publicidad-service.service';

@Component({
  selector: 'detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.css']
})
export class DetallesComponent implements OnInit {
  id_imagen: number;
  imagenDetalles: any;

  constructor(
    private route: ActivatedRoute,
     
    private publicidadService: PublicidadServiceService
  ) {}

  ngOnInit(): void {
    this.id_imagen = +this.route.snapshot.paramMap.get('id'); // Obtiene el ID de la ruta
    this.obtenerDetallesImagen();
  }

  obtenerDetallesImagen(): void {
    this.publicidadService.obtenerImagenPublicidad(this.id_imagen).subscribe(
      (response) => {
        this.imagenDetalles = response.data; // Asumiendo que la respuesta tiene un campo 'data'
      },
      (error) => {
        console.error('Error al obtener los detalles de la imagen', error);
      }
    );
  }
}