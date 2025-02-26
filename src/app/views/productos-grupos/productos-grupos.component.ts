import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'app/services/product.service';

@Component({
  selector: 'productos-grupos',
  templateUrl: './productos-grupos.component.html',
  styleUrls: ['./productos-grupos.component.css']
})
export class ProductosGruposComponent implements OnInit {
  productos = [];
  id_grupo: number;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del grupo de la ruta
    this.route.paramMap.subscribe(params => {
      this.id_grupo = +params.get('id_grupo'); // Obtener el ID del grupo
      this.listarProductosPorGrupo(this.id_grupo);
    });
  }

  listarProductosPorGrupo(id_grupo: number): void {
    // Lógica para obtener productos por grupo
    this.productService.listarProductosPorGrupo(id_grupo).subscribe(
      (response) => {
        this.productos = response.data; // Asegúrate de que la respuesta tenga la estructura correcta
        console.log("Productos del grupo:", this.productos);
      },
      (error) => {
        console.error("Error al obtener productos del grupo", error);
      }
    );
  }
}