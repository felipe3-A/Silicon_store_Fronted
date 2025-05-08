import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mision-vision',
  templateUrl: './mision-vision.component.html',
  styleUrls: ['./mision-vision.component.css']
})
export class MisionVisionComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
  }
  irATienda() {
    this.router.navigate(['/VerTienda']);
  }

}
