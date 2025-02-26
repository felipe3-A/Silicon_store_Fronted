import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'productos-categorias',
  templateUrl: './productos-categorias.component.html',
  styleUrls: ['./productos-categorias.component.css']
})
export class ProductosCategoriasComponent implements OnInit {

  categoriaId: number
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.categoriaId = +this.route.snapshot.paramMap.get('id_categoria')!;
    console.log('ID de la categoría seleccionada:', this.categoriaId);
    // Aquí puedes llamar a un servicio para cargar los datos de la categoría.
  }

}
