// categoria.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaServiceService } from 'app/services/Categoria/categoria-service.service';
import { ProductService } from 'app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  id_categoria: number;
  productos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.id_categoria = +this.route.snapshot.paramMap.get('id'); // Obtiene el ID de la ruta
    this.obtenerProductosPorCategoria();
  }

  obtenerProductosPorCategoria(): void {
    this.productService.listarProductosPorCategoria(this.id_categoria).subscribe(
      (response) => {
        this.productos = response.data; // Asumiendo que la respuesta tiene un campo 'data'
        console.log("Productos de la categoría:", this.productos);
      },
      (error) => {
        Swal.fire("Error", "No se pudieron obtener los productos de la categoría", "error");
        console.error("Error al obtener los productos de la categoría:", error);
      }
    );
  }
}