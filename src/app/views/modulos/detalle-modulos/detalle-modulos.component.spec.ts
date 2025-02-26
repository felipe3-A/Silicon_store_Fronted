import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleModulosComponent } from './detalle-modulos.component';

describe('DetalleModulosComponent', () => {
  let component: DetalleModulosComponent;
  let fixture: ComponentFixture<DetalleModulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleModulosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleModulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
