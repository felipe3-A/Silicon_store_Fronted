import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearModulosXperfilComponent } from './crear-modulos-xperfil.component';

describe('CrearModulosXperfilComponent', () => {
  let component: CrearModulosXperfilComponent;
  let fixture: ComponentFixture<CrearModulosXperfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearModulosXperfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearModulosXperfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
