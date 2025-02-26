import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListapedidosReparacionComponent } from './listapedidos-reparacion.component';

describe('ListapedidosReparacionComponent', () => {
  let component: ListapedidosReparacionComponent;
  let fixture: ComponentFixture<ListapedidosReparacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListapedidosReparacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListapedidosReparacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
