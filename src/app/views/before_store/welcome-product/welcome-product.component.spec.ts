import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeProductComponent } from './welcome-product.component';

describe('WelcomeProductComponent', () => {
  let component: WelcomeProductComponent;
  let fixture: ComponentFixture<WelcomeProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelcomeProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
