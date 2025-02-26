import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarMarcasComponent } from './administrar-marcas.component';

describe('AdministrarMarcasComponent', () => {
  let component: AdministrarMarcasComponent;
  let fixture: ComponentFixture<AdministrarMarcasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrarMarcasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrarMarcasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
