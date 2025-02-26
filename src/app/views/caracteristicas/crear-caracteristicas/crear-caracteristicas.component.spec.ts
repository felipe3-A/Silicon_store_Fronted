import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCaracteristicasComponent } from './crear-caracteristicas.component';

describe('CrearCaracteristicasComponent', () => {
  let component: CrearCaracteristicasComponent;
  let fixture: ComponentFixture<CrearCaracteristicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearCaracteristicasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearCaracteristicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
