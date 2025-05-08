import { Component, OnInit } from "@angular/core";
import { LoginService } from "../../services/usuarios/login-service.service";
import { Router } from "@angular/router"; // Importar Router desde '@angular/router'
import Swal from 'sweetalert2';  // Importa SweetAlert2

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  showPassword: boolean = false; // Propiedad para controlar si se muestra la contraseña o no
  passwordFocused: boolean = false;
  usuarios = {
    email: "",
    password: "",
  };
  errorMessage: string = ""; // Propiedad para almacenar el mensaje de error

  constructor(private loginService: LoginService, private router: Router) {}

  // Volver al home
  ngOnInit() {}
  
  backToHome() {
    this.router.navigate([""]);
  }

  // Toggle para mostrar/ocultar la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  irARegistro(): void {
    this.router.navigate(["/registro"]);
  }

  volverATienda() {
    // Reemplaza esta línea con la navegación que usas en tu app
    this.router.navigate(['/VerTienda']); 
  }
  

  onSubmit() {
    console.log("LoginService:", this.loginService);
    if (!this.loginService.postLogin) {
      console.error("Método postLogin no definido");
      return;
    }

    this.loginService.postLogin(this.usuarios).subscribe(
      (response) => {
        console.log("Inicio de sesión exitoso", response);
        console.log("Token recibido:", response.token);

        // Almacenar el token y el ID del usuario en el localStorage
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
        if (response.user && response.user.id) {
          localStorage.setItem("userId", response.user.id.toString());
        }

        // Mostrar la alerta de bienvenida
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: `Hola ${response.user.name}, ¡Has iniciado sesión con éxito!`,
          confirmButtonText: 'Aceptar'
        });

        // Redirigir según el tipo de perfil
        if (response.user && response.user.idperfil) {
          if (response.user.idperfil === 1) {
            this.router.navigate(['/dashboard']);
          } else if (response.user.idperfil === 2) {
            this.router.navigate(['/VerTienda']);
          } else {
            this.router.navigate(['/VerTienda']); // por defecto
          }
        } else {
          this.router.navigate(["/VerTienda"]); // Redirige a una ruta por defecto si no hay idperfil
        }
      },
      (error) => {
        console.error("Error al iniciar sesión", error);
        this.errorMessage = error.error?.error || "Usuario y Contraseña incorrectos";

        // Mostrar la alerta de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.errorMessage,
          confirmButtonText: 'Intentar nuevamente'
        });
      }
    );
    //this.loginService.setUserData(res.user); // Guardar datos manualmente

  }

}
