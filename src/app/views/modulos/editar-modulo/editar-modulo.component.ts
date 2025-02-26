import { ModuloServiceService } from './../../../services/modulo/modulo-service.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'editar-modulo',
  templateUrl: './editar-modulo.component.html',
  styleUrls: ['./editar-modulo.component.css']
})
export class EditarModuloComponent {
  @Input() ModuloSeleccionado: any;
  @Output() actualizarLista = new EventEmitter<void>();
  @Input() mostrarModal: boolean;
  @Output() closeModal = new EventEmitter<void>();

  iconos = [
    'fa-user', 'fa-users', 'fa-home', 'fa-book', 'fa-cog', 'fa-check',
    'fa-times', 'fa-edit', 'fa-trash', 'fa-save', 'fa-upload', 'fa-download',
    'fa-arrow-up', 'fa-arrow-down', 'fa-arrow-left', 'fa-arrow-right',
    'fa-building', 'fa-industry', 'fa-warehouse', 'fa-city', 'fa-business-time',
    'fa-landmark', 'fa-hotel', 'fa-school', 'fa-store', 'fa-university',
    'fa-list', 'fa-plus', 'fa-shield-alt', 'fa-user-shield', 'fa-camera', 'fa-key', 'fa-lock', 'fa-unlock', 'fa-bell', 'fa-video',
  ];
  iconoSeleccionado: string = '';


  constructor(private moduloService: ModuloServiceService) { }
  
  ngOnInit(): void {
    if (this.ModuloSeleccionado) {
      this.iconoSeleccionado = this.ModuloSeleccionado.icono;
    }
  }

  onSubmit() {
    if (this.validarFormulario()) {
      const moduloData = { ...this.ModuloSeleccionado };
      delete moduloData.idmodulo;  // Elimina el campo idmodulo

      console.log('Datos enviados:', moduloData);

      this.moduloService.editarModulo(this.ModuloSeleccionado.idmodulo, moduloData).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: '¡Actualización exitosa!',
            text: 'El módulo ha sido actualizado correctamente.'
          });
          this.actualizarLista.emit();
          this.close();
        },
        error => {
          console.error('Error en la solicitud:', error);
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: error.error ? error.error.message : 'Error desconocido'
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Formulario no válido'
      });
    }
  }

  validarFormulario(): boolean {
    return (
      this.ModuloSeleccionado.id_modulo_padre !== undefined &&
      this.ModuloSeleccionado.modulo !== '' &&
      this.ModuloSeleccionado.url_modulo !== '' &&
      this.ModuloSeleccionado.icono !== '' &&
      this.ModuloSeleccionado.orden !== undefined &&
      this.ModuloSeleccionado.hijos !== undefined &&
      this.validarRango(this.ModuloSeleccionado.hijos)
    );
  }

  validarRango(value: number): boolean {
    return value >= 0 && value <= 255; // Ajustar el rango si es necesario
  }

  seleccionarIcono(icono: string) {
    this.ModuloSeleccionado.icono = icono;
    this.iconoSeleccionado = icono;
  }

  close(): void {
    this.closeModal.emit();
  }


}
