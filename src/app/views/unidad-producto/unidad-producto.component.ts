import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarcasServiceService } from 'app/services/Marcas/marcas-service.service';
import { ProductService } from 'app/services/product.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'unidad-producto',
  templateUrl: './unidad-producto.component.html',
  styleUrls: ['./unidad-producto.component.css'],
})
export class UnidadProductoComponent implements OnInit {
  item_id!: number;
  logoMarca: string = ''; // URL del logo de la marca
  productoListado: any[] = [];
  galeriaImagenes: string[] = [];
  imagenPrincipal: string = 'https://via.placeholder.com/500';
  esFavorito: boolean = false;

  constructor(
    private serviceImagen: ProductService,
    private route: ActivatedRoute,
    private marcaService: MarcasServiceService
  ) {}

  ngOnInit(): void {
    this.item_id = +this.route.snapshot.paramMap.get('item_id')!;
    this.cargarProductoSeleccionado(this.item_id);
  }

  cambiarImagenPrincipal(index: number): void {
    this.imagenPrincipal = this.galeriaImagenes[index];
  }

  cargarProductoSeleccionado(item_id: number): void {
    this.serviceImagen.listarProductoId(item_id).subscribe((response) => {
      if (response?.data) {
        this.productoListado = [response.data];
        this.imagenPrincipal = this.productoListado[0]?.url_imagen;

        const marca$ = this.marcaService.obtenerMarcaPorId(this.productoListado[0]?.id_marca);
        const galeria$ = this.serviceImagen.obtenerGaleriaPorId(this.productoListado[0]?.id_galeria);

        forkJoin([marca$, galeria$]).subscribe(
          ([marcaResponse, galeriaResponse]) => {
            this.logoMarca = marcaResponse?.data?.logo_url || '';
            this.galeriaImagenes = JSON.parse(galeriaResponse?.data?.url_imagenes || '[]');
          },
          (error) => console.error('Error al cargar datos relacionados:', error)
        );
      }
    });
  }

  añadirCarrito(): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Producto añadido al carrito',
      showConfirmButton: false,
      timer: 2000,
    });
  }

  anadirCarrito(): void {
    // Aquí puedes implementar la lógica para añadir el producto al carrito
    Swal.fire('Producto añadido', '¡El producto ha sido añadido al carrito!', 'success');
  }
  
  marcarFavorito(): void {
    this.esFavorito = !this.esFavorito;
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: this.esFavorito ? 'info' : 'warning',
      title: this.esFavorito ? 'Añadido a favoritos' : 'Eliminado de favoritos',
      showConfirmButton: false,
      timer: 2000,
    });
  }
}
