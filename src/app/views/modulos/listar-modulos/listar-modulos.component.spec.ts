import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarModulosComponent } from './listar-modulos.component';

describe('ListarModulosComponent', () => {
  let component: ListarModulosComponent;
  let fixture: ComponentFixture<ListarModulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarModulosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarModulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
