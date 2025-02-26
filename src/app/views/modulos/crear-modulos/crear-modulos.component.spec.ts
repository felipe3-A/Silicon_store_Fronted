import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearModulosComponent } from './crear-modulos.component';

describe('CrearModulosComponent', () => {
  let component: CrearModulosComponent;
  let fixture: ComponentFixture<CrearModulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearModulosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearModulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
