import { ProductService } from 'app/services/product.service';
import { ValoresCaracteristicasServicesService } from './../../../services/valorescaracteristicas/valores-caracteristicas-services.service';
import { Component, OnInit } from '@angular/core';
import { SubCaracteristicasServicesService } from 'app/services/subcaracteristicas/sub-caracteristicas-services.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'crear-valores',
  templateUrl: './crear-valores.component.html',
  styleUrls: ['./crear-valores.component.css']
})
export class CrearValoresComponent implements OnInit {

  constructor(private serviceValores: ValoresCaracteristicasServicesService,
    private imageService: ProductService,
    private subService: SubCaracteristicasServicesService,
    private fb: FormBuilder
  ) { }

  valoresForm: FormGroup
  productosForm = []
  subcaracteristicasFor =[]
  subCaracteristicas :any[]=[]
  ngOnInit(): void {
    this.valoresForm= this.fb.group({
      id_imagen: ["",Validators.required],
      id_subcaracteristica :[ "", Validators.required],
      valor:["",[Validators.required]]
    })

    this.listarProductos();
    this.listarSubcaracteristicas();
    }

  crearValores(): void{
    if(this.valoresForm.invalid){
      this.valoresForm.markAllAsTouched();
      return;
    }

    // Crear un objeto FormData
    const valuesCaracteristicas = new FormData();
    valuesCaracteristicas.append("id_imagen", this.valoresForm.get("id_imagen")?.value);
    valuesCaracteristicas.append("id_subcaracteristica", this.valoresForm.get("id_subcaracteristica")?.value);
    valuesCaracteristicas.append("valor", this.valoresForm.get("valor")?.value); // Asegúrate de que este campo sea correcto
  
    console.log("Datos a Enviar", valuesCaracteristicas);

    this.serviceValores.createValorCaracteristica(valuesCaracteristicas).subscribe({
      next: () => {
        Swal.fire("Éxito", "Valores creados correctamente", "success");
        this.valoresForm.reset();
      },
      error: (err) => {
        console.error("Error al crear característica:", err);
        Swal.fire("Error", "No se pudo crear la Característica", "error");
      },
    }

    )
    
  }

  listarProductos():void{
    this.imageService.listarProductos().subscribe(
      (response)=>{
        console.log("Productos listados correctamente", response.data);
        this.productosForm = response.data
        
      },
      (error)=>{
        console.log("No se puderon listar os productos", error);
        
      }
    )
  }

  listarSubcaracteristicas():void{
this.subService.getAllCaracteristicas().subscribe(
  (response)=>{
    console.log("Subcaracteristicas Listadas correctamente", response.data[0]);
    this.subcaracteristicasFor = response.data[0]
    
  },
  (error)=>{
    console.log("No se listaron las categorias",error);
    
  }
)
  }
}
