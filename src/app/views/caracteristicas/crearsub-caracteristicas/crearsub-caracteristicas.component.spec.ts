import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearsubCaracteristicasComponent } from './crearsub-caracteristicas.component';

describe('CrearsubCaracteristicasComponent', () => {
  let component: CrearsubCaracteristicasComponent;
  let fixture: ComponentFixture<CrearsubCaracteristicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearsubCaracteristicasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearsubCaracteristicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
