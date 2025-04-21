import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../app/services/product.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.css']
})
export class DetalleComponent implements OnInit {
  producto: any;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductService,
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('item_id'));
    if (id) {
      this.productoService.listarProductoId(id).subscribe(producto => {
        this.producto = producto;
  
        // SEO dinámico
        this.title.setTitle(this.producto.name);
        this.meta.updateTag({ name: 'description', content: this.producto.description });
      });
    }
  }
  
  
}
