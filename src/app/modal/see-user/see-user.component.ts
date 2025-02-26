import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'see-user',
  templateUrl: './see-user.component.html',
  styleUrls: ['./see-user.component.css']
})
export class SeeUserComponent {
  @Input() usuarioSeleccionado: any = {}; // Recibe el usuario seleccionado
  @Output() close = new EventEmitter<void>(); // Emite un evento para cerrar el modal

  cerrarModal(): void {
    this.close.emit(); // Emite el evento al padre para cerrar el modal
  }

}
