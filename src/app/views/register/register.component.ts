import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UsuarioService } from 'app/services/usuarios/usuario-service.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  ubicacionActual: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      identificacion: ['', [Validators.required, Validators.maxLength(255)]],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10,13}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.obtenerUbicacion();
  }

  obtenerUbicacion() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.ubicacionActual = `Latitud: ${position.coords.latitude}, Longitud: ${position.coords.longitude}`;
          this.registroForm.patchValue({ direccion: this.ubicacionActual });
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
        }
      );
    } else {
      console.error('Geolocalización no soportada por el navegador.');
    }
  }

  registrarUsuario() {
    if (this.registroForm.valid) {
      const usuarioData = this.registroForm.value;

      this.usuarioService.crearUsuario(usuarioData).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: '¡Registro exitoso!',
            text: `Bienvenido, ${usuarioData.nombre}!`,
            confirmButtonText: 'Iniciar sesión'
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        (error) => {
          console.error('Error al registrar usuario:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al registrar el usuario. Inténtalo de nuevo.',
            confirmButtonText: 'Cerrar'
          });
        }
      );
    } else {
      console.error('Formulario inválido.');
    }
  }

  regresarAlMenu() {
    this.router.navigate(['/VerTienda']); // Cambia '/home' por la ruta de tu menú principal
  }
}