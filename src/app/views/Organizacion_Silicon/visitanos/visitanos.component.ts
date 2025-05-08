import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'visitanos',
  templateUrl: './visitanos.component.html',
  styleUrls: ['./visitanos.component.css']
})
export class VisitanosComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
  }
  irATienda() {
    this.router.navigate(['/VerTienda']);
  }
}
