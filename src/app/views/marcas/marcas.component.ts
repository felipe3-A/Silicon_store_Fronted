import { Component, OnInit } from "@angular/core";
import { MarcasServiceService } from "app/services/Marcas/marcas-service.service";
import Swal from "sweetalert2";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "marcas",
  templateUrl: "./marcas.component.html",
  styleUrls: ["./marcas.component.css"],
})
export class MarcasComponent implements OnInit {
  marcas = [];
  archivos: any[] = [];
  MarcaForm: FormGroup;
  previsualizacion: string = "";
  marcaSeleccionada: any; // Propiedad para almacenar los detalles de la marca seleccionada


  constructor(
    private serviceMarcas: MarcasServiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.MarcaForm = this.fb.group({
      marca: ["", [Validators.required]],
      logo_marca: ["", [Validators.required]],
    });
    this.listarMarcas();
  }

  listarMarcas(): void {
    this.serviceMarcas.listarMarcas().subscribe(
      (response) => {
        this.marcas = response.data.map((marca) => {
          if (marca.logo_marca) {
            marca.imagen = marca.logo_marca;
          }
          return marca;
        });
        console.log("MARCAS:", this.marcas);
      },
      (error) => {
        console.error("Error al obtener Productos", error);
      }
    );
  }

  crearProducto(): void {
    if (this.MarcaForm.invalid) {
      this.MarcaForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    if (this.archivos.length > 0) {
      formData.append("logo_marca", this.archivos[0]);
    }

    Object.keys(this.MarcaForm.controls).forEach((key) => {
      const controlValue = this.MarcaForm.get(key)?.value;
      console.log(key, controlValue); // Verifica que no esté siendo undefined
      if (controlValue === undefined || controlValue === "") {
        formData.append(key, null);
      } else {
        formData.append(key, controlValue); // Si el valor es undefined, agregar null
      }
    });
    this.serviceMarcas.crearMarca(formData).subscribe({
      next: () => {
        Swal.fire("Éxito", "Marca creada correctamente", "success");
        this.listarMarcas();
        this.MarcaForm.reset();
        this.archivos = [];
        this.previsualizacion = "";
      },
      error: () => Swal.fire("Error", "No se pudo crear la Marca", "error"),
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
}
