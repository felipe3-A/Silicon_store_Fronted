import { ModuloServiceService } from "./../../../services/modulo/modulo-service.service";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import Swal from "sweetalert2";

@Component({
  selector: "listar-modulos",
  templateUrl: "./listar-modulos.component.html",
  styleUrls: ["./listar-modulos.component.css"],
})
export class ListarModulosComponent implements OnInit {
  @ViewChild("modalContent") modalContent: ElementRef<any> | null = null;
  showModal: boolean = false;
  mostrarModalEditar: boolean = false;
  ModuloSeleccionado: any = {};
  modulofiltrado: any[] = [];
  modulos: any[] = [];
  cargando: boolean = true; // Variable para controlar la carga

  terminoBusqueda: string = "";
  noResultados: boolean = false;
  pageSize: number = 10;
  currentPage: number = 1;

  constructor(private moduloService: ModuloServiceService) {}

  ngOnInit(): void {
    // Colocar el tiempo a esperar
    setTimeout(() => {
      this.obtenerModulos();
    }, 3000);
  }
  setPage(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  getPages(): number[] {
    const pageCount = Math.ceil(this.modulos.length / this.pageSize);
    return Array(pageCount)
      .fill(0)
      .map((x, i) => i + 1);
  }

  obtenerModulos() {
    this.moduloService.obtenerModulos().subscribe(
      (response: any) => {
        this.modulos = response.data[0];
        this.cargando = false; // Ocultar el indicador de carga
        this.filtrarModulos();
      },
      (error) => {
        this.cargando = false; // Ocultar el indicador de carga
        console.error("Error al obtener los módulos:", error);
      }
    );
  }

  eliminarModulo(idmodulo: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.moduloService.eliminarModulo(idmodulo).subscribe(
          () => {
            this.modulos = this.modulos.filter(modulo => modulo.idmodulo !== idmodulo);
            Swal.fire(
              'Eliminado!',
              'El módulo ha sido eliminado.',
              'success'
            );
          },
          error => {
            Swal.fire(
              'Error!',
              'No se pudo eliminar. Es probable que esta informacion este relacionada con otra tabla.',
              'error'
            );
            console.error('Error al eliminar el módulo:', error);
          }
        );
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.mostrarModalEditar = false;
  }

  abrirModalEditar(item: any): void {
    this.ModuloSeleccionado = item;
    this.mostrarModalEditar = true;
  }

  handleCloseModal(): void {
    this.mostrarModalEditar = false;
  }

  filtrarModulos(): void{
    if (this.terminoBusqueda.trim() !== '') {
        this.modulofiltrado = this.modulos.filter(modulo => {
      return (
        modulo.modulo.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        modulo.url_modulo.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        modulo.icono.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        modulo.orden.toString().toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        modulo.hijos.toString().toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
    });
    this.noResultados = this.modulofiltrado.length === 0;
    this.currentPage = 1
  
  }else{
    this.modulofiltrado=[...this.modulos]
  }

  
  
  }
  pageChange(event: number): void {
    this.currentPage = event;
  }

}
