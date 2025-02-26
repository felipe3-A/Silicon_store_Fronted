import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModuloServiceService } from '../../../services/modulo/modulo-service.service';
import Swal from 'sweetalert2';
import { AdminLayoutRoutes } from "../../../layouts/admin-layout/admin-layout.routing";

@Component({
  selector: 'crear-modulos',
  templateUrl: './crear-modulos.component.html',
  styleUrls: ['./crear-modulos.component.css']
})
export class CrearModulosComponent   {
moduloData:any ={
  id_modulo_padre:'',
  modulo:'',
  url_modulo:'',
  icono:'',
  orden:'',
}

iconos = [
  'fa-user', 'fa-users', 'fa-home', 'fa-book', 'fa-cog', 'fa-check', 
  'fa-times', 'fa-edit', 'fa-trash', 'fa-save', 'fa-upload', 'fa-download',
  'fa-arrow-up', 'fa-arrow-down', 'fa-arrow-left', 'fa-arrow-right',
  'fa-building', 'fa-industry', 'fa-warehouse', 'fa-city', 'fa-business-time', 
  'fa-landmark', 'fa-hotel', 'fa-school', 'fa-store', 'fa-university',
  'fa-list', 'fa-plus',  'fa-shield-alt', 'fa-user-shield','fa-camera', 'fa-key', 'fa-lock', 'fa-unlock', 'fa-bell', 'fa-video',

];
rutas: string[] = [];

iconoSeleccionado: string = '';




constructor(private moduloService: ModuloServiceService, private router: Router) {
   
}

ngOnInit(): void {
  console.log("AdminLayoutRoutes:", AdminLayoutRoutes);
  if (AdminLayoutRoutes && AdminLayoutRoutes.length > 0) {
    console.log("AdminLayoutRoutes contiene rutas definidas");
    this.listarRutas();
  } else {
    console.error("AdminLayoutRoutes no contiene rutas definidas");
  }
}

onSubmit() {
  if (this.validarFormulario()) {
    console.log("Datos a enviar:", this.moduloData); // Verifica los datos
    this.moduloService.crearModulo(this.moduloData).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'El módulo ha sido registrado correctamente.'
        });
        this.router.navigateByUrl('/listarModulos');
      },
      error => {
        console.error("Error al crear módulo:", error); // Agrega un log para ver el error
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
    this.moduloData.id_modulo_padre !== '' &&
    this.moduloData.modulo !== '' &&
    this.moduloData.url_modulo !== '' &&
    this.moduloData.icono !== '' &&
    this.moduloData.orden !== '' &&
    this.validarRango(Number(this.moduloData.hijos))
  );
}

validarRango(value: number): boolean {
  return value >= 0 && value <= 255; // Ajustar el rango si es necesario
}

seleccionarIcono(icono: string) {
  this.moduloData.icono = icono;
  this.iconoSeleccionado = icono;
}

listarRutas() {
  AdminLayoutRoutes.forEach(route => {
    if (route.path !== '' && route.path !== 'store') {
      this.rutas.push(route.path);
      if (route.children) {
        route.children.forEach(child => {
          if (child.path !== '') {
            this.rutas.push(`${route.path}/${child.path}`);
          }
        });
      }
    }
  });
}


}
