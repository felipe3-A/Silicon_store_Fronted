import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarcasServiceService } from 'app/services/Marcas/marcas-service.service';
import { SolicitudServiceService } from 'app/services/Solicitudes/solicitud-service.service';

@Component({
  selector: 'pedidos-reparacion',
  templateUrl: './pedidos-reparacion.component.html',
  styleUrls: ['./pedidos-reparacion.component.css'],
})
export class PedidosReparacionComponent implements OnInit {
  solicitudesForm!: FormGroup;
  marcasForm: any[] = [];
  TipoServicioForm: any[] = [];
  TipoArticuloForm: any[] = [];

  constructor(
    private fb: FormBuilder,
    private marcaService: MarcasServiceService,
    private solicitudService: SolicitudServiceService
  ) {}

  ngOnInit(): void {
    this.solicitudesForm = this.fb.group({
      descripcion_falla: ['', [Validators.required]],
      fecha_compra: ['', [Validators.required]],
      fecha_vendimiento_garantia: ['', [Validators.required]],
      numero_factura: ['', [Validators.required]],
      garantia: ['', [Validators.required]],
      tipo_solicitud: ['', [Validators.required]],
      id_marca: ['', [Validators.required]],
      id_tipo_articulo: ['', [Validators.required]],
    });

    this.listarMarcas();
    this.listarTipoArticulo();
    this.listarTipoServicio();
  }

  listarMarcas(): void {
    this.marcaService.listarMarcas().subscribe(
      (response) => {
        this.marcasForm = response.data;
      },
      (error) => {
        console.error('No se pudieron listar las marcas', error);
      }
    );
  }

  listarTipoServicio(): void {
    this.solicitudService.listarTipoServicio().subscribe(
      (response) => {
        this.TipoServicioForm = response.data;
      },
      (error) => {
        console.error('No se pudieron listar los tipos de servicio', error);
      }
    );
  }

  listarTipoArticulo(): void {
    this.solicitudService.listarTipoArticulo().subscribe(
      (response) => {
        this.TipoArticuloForm = response.data;
      },
      (error) => {
        console.error('No se pudieron listar los tipos de artículo', error);
      }
    );
  }

  crearSolicitud(): void {
    if (this.solicitudesForm.valid) {
      console.log('Formulario enviado:', this.solicitudesForm.value);
      // Aquí puedes implementar la lógica para enviar la solicitud al backend
    } else {
      console.log('Formulario inválido');
    }
  }
}
