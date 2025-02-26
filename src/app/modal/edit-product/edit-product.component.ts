import { Component, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { ProductService } from 'app/services/product.service';

@Component({
  selector: 'edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent {

  @Input() mostrarModalEditar: boolean = false;
  @Input() productoSeleccionado: any
  @Output() closeModal = new EventEmitter<void>();
  @Output() actualizarProducto = new EventEmitter<void>();

  constructor(private productoService: ProductService) { }

  isValidDecimal(value: string): boolean {
    return !isNaN(parseFloat(value)) && /^\d+(\.\d{1,2})?$/.test(value);
  }
  
  actuProducto(): void {
  
    const productoActualizado = {
      nombre_producto: this.productoSeleccionado.nombre_producto,
      descripcion_producto: this.productoSeleccionado.descripcion_producto,
      precio_producto: parseFloat(this.productoSeleccionado.precio_producto.trim()),  // Asegurarse de que el precio esté limpio

      imagen: this.productoSeleccionado.imagen || '',  // Usar la imagen actual si no se especifica una nueva
      referencia_producto: this.productoSeleccionado.referencia_producto,
      categoria_producto: this.productoSeleccionado.categoria_producto,
      cantidad_producto: this.productoSeleccionado.cantidad_producto,
      garantia_producto: this.productoSeleccionado.garantia_producto,
      marca_producto: this.productoSeleccionado.marca_producto,
      envio_producto: this.productoSeleccionado.envio_producto,
      id_categoria : this.productoSeleccionado.id_categoria,
      id_narca: this.productoSeleccionado.id_marca

    };
  
    // Llamada al servicio para actualizar el producto
    this.productoService.editarProducto(this.productoSeleccionado.id_producto, productoActualizado).subscribe(
      response => {
        console.log('Producto actualizado:', response);

        this.actualizarProducto.emit();  // Notificar que el producto ha sido actualizado
      
        this.closeModal.emit();  // Cerrar el modal

        Swal.fire({
          icon: 'success',
          title: '¡Producto actualizado!',
          text: 'El producto ha sido actualizado correctamente.'
        });
      },
      error => {
        console.error('Error al actualizar el producto:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al intentar actualizar el producto. Por favor, inténtalo de nuevo.'
        });
      }
    );
    this.close();
  }
  
  
  

  // Método para cerrar el modal
  close(): void {
    this.mostrarModalEditar = false // Emitir evento para cerrar el modal

  }


  ngOnInit(): void {
    // Se puede agregar lógica adicional si es necesario
  }
}
