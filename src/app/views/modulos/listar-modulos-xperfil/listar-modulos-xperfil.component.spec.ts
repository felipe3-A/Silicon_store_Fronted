import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarModulosXperfilComponent } from './listar-modulos-xperfil.component';

describe('ListarModulosXperfilComponent', () => {
  let component: ListarModulosXperfilComponent;
  let fixture: ComponentFixture<ListarModulosXperfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarModulosXperfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarModulosXperfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
