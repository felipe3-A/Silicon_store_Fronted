import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'visitanos',
  templateUrl: './visitanos.component.html',
  styleUrls: ['./visitanos.component.css']
})
export class VisitanosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  services = [
    {
      title: 'Reparación de Electrodomésticos de Línea Blanca',
      description: 'Reparamos lavadoras, neveras, estufas y más. Servicios rápidos y garantizados.',

    },
    {
      title: 'Venta de Productos de Línea Blanca y Marrón',
      description: 'Encuentra electrodomésticos nuevos y reacondicionados al mejor precio.',

    },
    {
      title: 'Servicio Técnico Especializado',
      description: 'Atención personalizada y técnicos certificados para resolver tus problemas.',
    },
  ];



}
