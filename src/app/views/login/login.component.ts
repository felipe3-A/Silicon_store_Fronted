import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../services/usuarios/login-service.service"
import { Router } from '@angular/router'; // Importar Router desde '@angular/router'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  showPassword: boolean = false; // Propiedad para contidperfilar si se muestra la contraseña o no
  passwordFocused: boolean = false;
  usuarios = {
    email: '',
    password: ''
  };
  errorMessage: string = ''; // Propiedad para almacenar el mensaje de error

 
  constructor(private loginService: LoginService, private router: Router) { }

  //Volver al home 
  ngOnInit(){}
  backToHome(){
    this.router.navigate([''])
  }
  //Cerrando el ciclo

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Cambia el estado de la propiedad para mostrar/ocultar la contraseña
  }

  irARegistro(): void {
    this.router.navigate(['/registro']); // Navega a la ruta de registro
  }

  onSubmit() {
    console.log('LoginService:', this.loginService);
    if (!this.loginService.postLogin) {
      console.error('Método postLogin no definido');
      return;
    }
    
    this.loginService.postLogin(this.usuarios).subscribe(response => {
      console.log('Inicio de sesión exitoso', response);
      
      // Almacenar el token y el ID del usuario en el localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      if (response.user && response.user.id) {
        localStorage.setItem('userId', response.user.id.toString()); // Almacena el ID del usuario
      }
  
 // Redirigir según el tipo de perfil
 if (response.user && response.user.idperfil) {
  if (response.user.perfil === "admin") {
    this.router.navigate(['/dashboard']); // Redirige a la ruta principal para el idperfil 1
  } else if (response.user.idperfil === 2) {
    this.router.navigate(['/VerTienda']); // Redirige a la tienda para el idperfil 2
  } else {
    this.router.navigate(['/CrearProducto']); // Redirige a una ruta por defecto si el idperfil no coincide
  }
} else {
  this.router.navigate(['/CrearProducto']); // Redirige a una ruta por defecto si no hay idperfil
}    }, error => {
      console.error('Error al iniciar sesión', error);
      this.errorMessage = error.error?.error || 'Usuario y Contraseña incorrectos';
    });
  }
  



}
