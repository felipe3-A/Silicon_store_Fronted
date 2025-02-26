import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'empty-layout',
  template: `<router-outlet></router-outlet>`, // Solo renderiza el contenido de las rutas hijas
  styles: []
})
export class EmptyLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
