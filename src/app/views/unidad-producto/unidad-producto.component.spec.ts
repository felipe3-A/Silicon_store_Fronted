import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadProductoComponent } from './unidad-producto.component';

describe('UnidadProductoComponent', () => {
  let component: UnidadProductoComponent;
  let fixture: ComponentFixture<UnidadProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnidadProductoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
