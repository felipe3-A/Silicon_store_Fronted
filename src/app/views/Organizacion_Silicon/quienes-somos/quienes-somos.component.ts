import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'quienes-somos',
  templateUrl: './quienes-somos.component.html',
  styleUrls: ['./quienes-somos.component.css']
})
export class QuienesSomosComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  
irATienda() {
  this.router.navigate(['/VerTienda']);
}
}
