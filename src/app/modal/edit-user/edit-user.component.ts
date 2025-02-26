import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UsuarioService } from 'app/services/usuarios/usuario-service.service';
import { response } from 'express';
import Swal from 'sweetalert2';


@Component({
  selector: 'edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  @Input() usuarioSeleccionado: any = {} 
  @Output() closeModal = new EventEmitter<void>();
  @Output() actualizarUsuario = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>(); // Emite un evento para cerrar el modal

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
  }

  actuUsuario(): void{
    const usuarioActualizado ={
      nombre: this.usuarioSeleccionado.nombre,
      identificacion: this.usuarioSeleccionado.identificacion,
      direccion: this.usuarioSeleccionado.direccion,
      email: this.usuarioSeleccionado.email,
      telefono: this.usuarioSeleccionado.telefono,
      pago: this.usuarioSeleccionado.pago

    }

    this.usuarioService.editarUsuario(this.usuarioSeleccionado.id, usuarioActualizado).subscribe(
      response =>{
        console.log('Usuario Actualizado: ', response);
        this.closeModal.emit();
        this.actualizarUsuario.emit();        
         Swal.fire({
                  icon: 'success',
                  title: 'Uusario actualizado!',
                  text: 'El usuario ha sido actualizado correctamente.'
                });
                this.usuarioSeleccionado = {};
       },
            error => {
              console.error('Error al actualizar el usuario:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al intentar actualizar el usuario. Por favor, inténtalo de nuevo.'
              });
            }
      
    )
    
  }
  
  cerrarModalEU(): void {
    console.log('Cerrando modal...');
    this.close.emit(); // Emite el evento al padre
  }
  

}
