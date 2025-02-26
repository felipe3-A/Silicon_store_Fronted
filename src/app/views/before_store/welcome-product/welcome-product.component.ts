import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'welcome-product',
  templateUrl: './welcome-product.component.html',
  styleUrls: ['./welcome-product.component.css']
})
export class WelcomeProductComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

 

}
