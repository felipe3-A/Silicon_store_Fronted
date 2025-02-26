import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'oferts',
  templateUrl: './oferts.component.html',
  styleUrls: ['./oferts.component.css']
})
export class OfertsComponent implements OnInit {
  productosOfertas = [
    {
      nombre: 'Producto Oferta 1',
      precio: 19.99,
      imagen: 'https://i.blogs.es/d542e0/samsung-55s85d/450_1000.jpg'
    },
    {
      nombre: 'Producto Oferta 2',
      precio: 29.99,
      imagen: 'https://i.blogs.es/d542e0/samsung-55s85d/450_1000.jpg'
    },
    {
      nombre: 'Producto Oferta 3',
      precio: 9.99,
      imagen: 'https://i.blogs.es/d542e0/samsung-55s85d/450_1000.jpg'
    },
    {
      nombre: 'Producto Oferta 4',
      precio: 14.99,
      imagen: 'https://i.blogs.es/d542e0/samsung-55s85d/450_1000.jpg'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
