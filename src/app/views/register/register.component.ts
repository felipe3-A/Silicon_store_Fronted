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
  departamentos: any[] = [];
  ciudades: string[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    this.registroForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.maxLength(255)]],
      last_name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.maxLength(255)]],
      address_1: ['', [Validators.required, Validators.maxLength(255)]],
      address_2: ['', [Validators.maxLength(255)]],
      city: ['', [Validators.required, Validators.maxLength(255)]],
      state: ['', [Validators.required, Validators.maxLength(255)]],
      zip: ['', [Validators.required, Validators.maxLength(255)]],
      country: ['', [Validators.required, Validators.maxLength(255)]],
      comments: ['Bienvenido a Silicon Store'],
      company_name: ['', [Validators.maxLength(255)]],
      account_number: ['', [Validators.required, Validators.maxLength(255)]],
      discount: [0, [Validators.required, Validators.min(0)]],
      discount_type: [false, [Validators.required]],
      package_id: [null],
      points: [0],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/)
      ]],
      password_confirmation: ['', [Validators.required]]
    }, {
      validators: this.passwordsMatchValidator
    });
    
  }

  ngOnInit(): void {
    this.usuarioService.obtenerUbicaciones().subscribe(data => {
      this.departamentos = data;
    });

    this.registroForm.get('state')?.valueChanges.subscribe(depId => {
      const dept = this.departamentos.find(d => d.id == depId);
      this.ciudades = dept ? dept.ciudades : [];
      this.registroForm.get('city')?.setValue('');
    });
  }



  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('password_confirmation')?.value;
    return password === confirm ? null : { passwordMismatch: true };
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