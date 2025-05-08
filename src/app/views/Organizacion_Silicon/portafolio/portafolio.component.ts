import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'portafolio',
  templateUrl: './portafolio.component.html',
  styleUrls: ['./portafolio.component.css']
})
export class PortafolioComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  irATienda() {
    this.router.navigate(['/VerTienda']);
  }

}
