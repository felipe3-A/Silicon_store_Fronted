import { Component, OnInit } from '@angular/core';
import { SolicitudServiceService } from 'app/services/Solicitudes/solicitud-service.service';

@Component({
  selector: 'listapedidos-reparacion',
  templateUrl: './listapedidos-reparacion.component.html',
  styleUrls: ['./listapedidos-reparacion.component.css']
})
export class ListapedidosReparacionComponent implements OnInit {
  solicitudes: any[] = [];

  constructor(private solicitudService: SolicitudServiceService) {}

  ngOnInit(): void {
    this.listarSolicitudes();
  }

  listarSolicitudes(): void {
    this.solicitudService.listarSolicitudes().subscribe(
      (response) => {
        console.log('Solicitudes listadas:', response);
        this.solicitudes = response.data; // Asegúrate de que `data` sea la estructura correcta
      },
      (error) => {
        console.error('Error al listar las solicitudes:', error);
      }
    );
  }

  editarSolicitud(id: number): void {
    console.log(`Editar solicitud con ID: ${id}`);
    // Implementa la lógica de edición
  }

  eliminarSolicitud(id: number): void {
    console.log(`Eliminar solicitud con ID: ${id}`);
    // Implementa la lógica para eliminar
  }
}
