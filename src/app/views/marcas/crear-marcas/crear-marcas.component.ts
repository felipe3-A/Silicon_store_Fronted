// crear-marcas.component.ts
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MarcasServiceService } from "app/services/Marcas/marcas-service.service";
import Swal from "sweetalert2";

@Component({
  selector: "crear-marcas",
  templateUrl: "./crear-marcas.component.html",
  styleUrls: ["./crear-marcas.component.css"],
})
export class CrearMarcasComponent implements OnInit {
  archivos: any[] = [];
  MarcaForm: FormGroup;
  previsualizacion: string = "";

  constructor(private serviceMarcas: MarcasServiceService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.MarcaForm = this.fb.group({
      marca: ["", [Validators.required]],
      logo_marca: ["", [Validators.required]],
    });
  }

  crearMarca(): void {
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
      if (controlValue !== undefined && controlValue !== "") {
        formData.append(key, controlValue);
      }
    });

    this.serviceMarcas.crearMarca(formData).subscribe({
      next: () => {
        Swal.fire("Éxito", "Marca creada correctamente", "success");
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
      const tiposPermitidos = ["image/jpeg", "image/png", "image/jpg", "image/avif", "image/webp"];
      if (!tiposPermitidos.includes(archivo.type)) {
        Swal.fire("Error", "El archivo debe ser una imagen (JPEG/PNG/JPG/AVIF/WEBP)", "error");
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
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve({ base: reader.result });
      reader.onerror = () => resolve({ base: null });
    });
}