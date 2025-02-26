import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuestrasMarcasComponent } from './nuestras-marcas.component';

describe('NuestrasMarcasComponent', () => {
  let component: NuestrasMarcasComponent;
  let fixture: ComponentFixture<NuestrasMarcasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuestrasMarcasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuestrasMarcasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
