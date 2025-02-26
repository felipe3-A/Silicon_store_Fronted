import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarEstadoComponent } from './consultar-estado.component';

describe('ConsultarEstadoComponent', () => {
  let component: ConsultarEstadoComponent;
  let fixture: ComponentFixture<ConsultarEstadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarEstadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
