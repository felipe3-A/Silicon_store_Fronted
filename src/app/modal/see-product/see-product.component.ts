import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-see-product',
  templateUrl: './see-product.component.html',
  styleUrls: ['./see-product.component.css']
})
export class SeeProductComponent {
  @Input() productoSeleccionado: any; // Recibe el producto seleccionado
  @Output() closeModal = new EventEmitter<void>(); // Emite un evento para cerrar el modal

  close(): void {
    this.closeModal.emit(); // Emite el evento al padre para cerrar el modal
  }
}
