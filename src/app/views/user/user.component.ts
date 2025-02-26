import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import Swal from "sweetalert2";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UsuarioService } from "app/services/usuarios/usuario-service.service";
import { Router } from "@angular/router";

@Component({
  selector: "user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  usuarios = [];
  usuarioForm: FormGroup;
  usuarioSeleccionado: any = {};

  UsuarioData: any = {
    nombre: null,
    email: null,
    identificacion: null,
    direccion: null,
    telefono: null,
    pago: null,
  };

  @ViewChild("modalContent") modalContent: ElementRef<any> | null = null;

  verModalS: boolean = false;
  verModalE: boolean = false;

  pageSize: number = 10; // Número de usuarios por página
  currentPage: number = 1; // Página actual
  terminoBusqueda: string = "";

  usuarioFiltrado: any[] = [];
  noResultados: boolean = false;

  MostarEditarUser: boolean = false;
  MostrarVerUser: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        title: "Sesión expirada",
        text: "Por favor inicia sesión nuevamente",
        icon: "warning",
        confirmButtonText: "Aceptar",
      }).then(() => {
        this.router.navigate(["/login"]);
      });
      return; // Detén la ejecución si no hay token
    }

    this.listarUsuarios();
  }

  listarUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe(
      (response) => {
        console.log("Respuesta del servicio para usuarios:", response);
        this.usuarios = response.data;
        this.filtrarUusarios();
      },
      (error) => {
        console.error("Error al listar los Usuarios", error);
        if (error.status === 401) {
          Swal.fire({
            title: "Sesión expirada",
            text: "Por favor inicia sesión nuevamente",
            icon: "warning",
            confirmButtonText: "Aceptar",
          }).then(() => {
            this.router.navigate(["/login"]); // Redirige a la página de inicio de sesión
          });
        }
      }
    );
  }

  filtrarUusarios(): void {
    if (this.terminoBusqueda.trim() !== "") {
      this.usuarioFiltrado = this.usuarios.filter((usuario) => {
        return (
          usuario.nombre
            .toLowerCase()
            .includes(this.terminoBusqueda.toLowerCase()) ||
          usuario.email
            .toLowerCase()
            .includes(this.terminoBusqueda.toLowerCase()) ||
          usuario.identificacion
            .toLowerCase()
            .includes(this.terminoBusqueda.toLowerCase()) ||
          usuario.direccion
            .toLowerCase()
            .includes(this.terminoBusqueda.toLowerCase()) ||
          usuario.telefono
            .toLowerCase()
            .includes(this.terminoBusqueda.toLowerCase())
        );
      });

      this.noResultados = this.usuarioFiltrado.length === 0;
      this.currentPage = 1;
    }else{
      this.usuarioFiltrado= [...this.usuarios]
    }
  }
  pageChange(event: number): void {
    this.currentPage = event;
  }

  closeModalUser(): void {
    this.verModalE = false;
    this.verModalS = false; // Corrige esta línea
  }

  AbrirModalVerUser(usuario: any): void {
    this.usuarioSeleccionado = usuario;
    this.verModalS = true; // Abre el modal de ver usuario
    this.verModalE = false; // Cierra el modal de editar usuario
  }

  AbrirModalEditarUser(usuario: any): void {
    this.UsuarioData = { ...usuario }; // Copia los datos del usuario
    this.verModalE = true; // Abre el modal de editar usuario
    this.verModalS = false; // Cierra el modal de ver usuario
  }

  eliminarUsuario(id: number): void {
    Swal.fire({
      title: "¿Seguro que quieres borrar este usuario permanentemente?",
      text: "No se puede volver a recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, estoy seguro",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(id).subscribe(
          () => {
            Swal.fire("¡Éxito!", "Usuario Eliminado exitosamente", "success");
            this.listarUsuarios(); // Actualizamos la lista de usuarios
          },
          (error) => {
            Swal.fire("¡Error!", "El usuario no se pudo borrar", "error");
          }
        );
      }
    });
  }
}
