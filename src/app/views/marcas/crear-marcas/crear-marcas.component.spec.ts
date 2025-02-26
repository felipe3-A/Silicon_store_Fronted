import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearMarcasComponent } from './crear-marcas.component';

describe('CrearMarcasComponent', () => {
  let component: CrearMarcasComponent;
  let fixture: ComponentFixture<CrearMarcasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearMarcasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearMarcasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
