import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosReparacionComponent } from './pedidos-reparacion.component';

describe('PedidosReparacionComponent', () => {
  let component: PedidosReparacionComponent;
  let fixture: ComponentFixture<PedidosReparacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedidosReparacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosReparacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
