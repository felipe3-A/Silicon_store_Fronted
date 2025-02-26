import { Component, OnInit } from '@angular/core';
import { ProductService } from 'app/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ver-productos',
  templateUrl: './ver-productos.component.html',
  styleUrls: ['./ver-productos.component.css']
})
export class VerProductosComponent implements OnInit {
  categoriaId!: number; // ID de la categoría capturada desde la URL
  productos: any[] = []; // Lista de productos de la categoría

  constructor(
    private serviceImages: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Capturar el id de la categoría desde la URL (con el nombre 'id_categoria')
    this.categoriaId = +this.route.snapshot.paramMap.get('id_categoria')!;
    console.log('ID de la categoría:', this.categoriaId);

    // Cargar los productos de la categoría
    this.cargarProductos(this.categoriaId);
  }

  cargarProductos(idCategoria: number): void {
    this.serviceImages.listarProductosPorCategoria(idCategoria).subscribe(
      (response) => {
        console.log('Respuesta de la API:', response); // Verifica la estructura de la respuesta
        if (Array.isArray(response)) {
          // Mapear y procesar los productos si es necesario
          this.productos = response.map((producto) => ({
            ...producto,
            imagen: producto.url_imagen || 'ruta/por/defecto.png' // Si no hay imagen, asigna una por defecto
          }));
        } else {
          console.error('Formato inesperado de respuesta:', response);
        }
        console.log('Productos procesados:', this.productos);
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      }
    );
  }
}
