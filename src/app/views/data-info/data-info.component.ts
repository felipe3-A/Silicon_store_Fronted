import { Component, OnInit } from '@angular/core';
import { DataInfoService } from '../../services/data-info.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-data-info',
  templateUrl: './data-info.component.html',
})
export class DataInfoComponent implements OnInit {
  lista: any[] = [];
  dataNueva = {
    data: '',
    info: '',
    icono: 'bi bi-star',
  };
  modoEdicion = false;
  idEditando: number | null = null;

  iconos = [
    { nombre: 'Casa', clase: 'bi bi-house' },
    { nombre: 'Estrella', clase: 'bi bi-star' },
    { nombre: 'Rayo', clase: 'bi bi-lightning' },
    { nombre: 'Libro', clase: 'bi bi-book' },
    { nombre: 'Caja', clase: 'bi bi-box' },
    { nombre: 'Reloj', clase: 'bi bi-clock' },
  ];

  constructor(private dataInfoService: DataInfoService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.dataInfoService.getAll().subscribe(data => {
      this.lista = data;
      console.log('Datos cargados:', data); // 👈 Aquí mostramos los datos en consola
    });
  }
  

  guardar(): void {
    if (this.modoEdicion && this.idEditando !== null) {
      this.dataInfoService.update(this.idEditando, this.dataNueva).subscribe(() => {
        Swal.fire('Actualizado', 'El registro fue actualizado correctamente', 'success');
        this.resetFormulario();
        this.cargarDatos();
      });
    } else {
      this.dataInfoService.create(this.dataNueva).subscribe(() => {
        Swal.fire('Guardado', 'Registro creado exitosamente', 'success');
        this.resetFormulario();
        this.cargarDatos();
      });
    }
  }

  editar(data: any): void {
    this.dataNueva = {
      data: data.data,
      info: data.info,
      icono: data.icono,
    };
    this.modoEdicion = true;
    this.idEditando = data.iddata_info;
  }

  eliminar(iddata_info: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataInfoService.delete(iddata_info).subscribe(() => {
          Swal.fire('Eliminado', 'El registro fue eliminado correctamente', 'success');
          this.cargarDatos();
        });
      }
    });
  }

  resetFormulario(): void {
    this.dataNueva = { data: '', info: '', icono: 'bi bi-star' };
    this.modoEdicion = false;
    this.idEditando = null;
  }
}
