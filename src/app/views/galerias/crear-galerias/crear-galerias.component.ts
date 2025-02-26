import { Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ProductService } from "app/services/product.service";

import Swal from "sweetalert2";

@Component({
  selector: 'crear-galerias',
  templateUrl: './crear-galerias.component.html',
  styleUrls: ['./crear-galerias.component.css']
})
export class CrearGaleriasComponent implements OnInit {
  step: number = 1; // Para manejar los pasos
  galeriaForm: FormGroup;
  archivos: any[] = [];
  previsualizacion: string = "";

  productForm: FormGroup;

  constructor(   private fb: FormBuilder,
      private productService: ProductService,
    private router: Router) { }

  ngOnInit(): void {
    this.galeriaForm = this.fb.group({
      url_imagenes: ["", [Validators.required]],
      titulo_grupo: ["", [Validators.required]],
  });
  }

  navegarparte2(){
    this.router.navigateByUrl('/AdministarProductos')
  }
  crearGaleria(): void {
    const formData = new FormData();
    this.archivos.forEach((archivo) => {
        formData.append("url_imagenes", archivo.file);
    });

    // Agregar el título del grupo al FormData
    formData.append("titulo_grupo", this.galeriaForm.get('titulo_grupo')?.value);

    this.productService.crearGaleria(formData).subscribe({
        next: (response: any) => {
            // Almacenar el ID de la galería creada en localStorage
            const idGaleria = response.data.id; // Asegúrate de que esta propiedad exista
            localStorage.setItem('id_galeria', idGaleria); // Guardar el ID en localStorage
            Swal.fire({
                icon: 'success',
                title: 'Genial ahora puedes Continuar!',
                text: 'Agrega lo ultimos detalles.',
            });
            this.navegarparte2()
            this.step = 2; // Cambia al siguiente paso
            this.galeriaForm.reset(); // Reiniciar el formulario
            this.archivos = []; // Limpiar archivos
        },
        error: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo crear la galería. Intenta nuevamente.',
            });
            console.error('Error al crear la galería:', error);
        }
    });
}
  capturarFile(event: any): void {
    const archivo = event.target.files[0];
    if (archivo) {
      const tiposPermitidos = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/avif",
        "image/webp",
      ];
      if (!tiposPermitidos.includes(archivo.type)) {
        Swal.fire(
          "Error",
          "El archivo debe ser una imagen (JPEG/PNG/JPG/AVIF/WEBP)",
          "error"
        );
        return;
      }
      this.archivos.push(archivo);
      this.extraerBase64(archivo).then((imagen: any) => {
        this.previsualizacion = imagen.base || "";
      });
    }
  }

  extraerBase64 = async (file: File) =>
    new Promise((resolve) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve({ base: reader.result });
        reader.onerror = () => resolve({ base: null });
      } catch {
        resolve({ base: null });
      }
    });

    capturarGaleria(event: any): void {
      const archivos = event.target.files;
      this.archivos = [];
      for (let i = 0; i < archivos.length; i++) {
        const archivo = archivos[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.archivos.push({ url: e.target.result, file: archivo });
        };
        reader.readAsDataURL(archivo);
      }
    }
  
  
}
