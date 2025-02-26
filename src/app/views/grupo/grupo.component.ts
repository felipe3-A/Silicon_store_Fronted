// grupo.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GrupoServiceService } from 'app/services/Grupo/grupo-service.service';
import { ProductService } from 'app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css']
})
export class GrupoComponent implements OnInit {
  id_grupo: number;
  productos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private grupoService: GrupoServiceService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.id_grupo = +this.route.snapshot.paramMap.get('id'); // Obtiene el ID de la ruta
    this.obtenerProductosPorGrupo();
  }

  obtenerProductosPorGrupo(): void {
    this.productService.listarProductosPorGrupo(this.id_grupo).subscribe(
      (response) => {
        this.productos = response.data; // Asumiendo que la respuesta tiene un campo 'data'
        console.log("Productos del grupo:", this.productos);
      },
      (error) => {
        Swal.fire("Error", "No se pudieron obtener los productos del grupo", "error");
        console.error("Error al obtener los productos del grupo:", error);
      }
    );
  }
}