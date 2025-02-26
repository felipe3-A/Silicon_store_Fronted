import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearGaleriasComponent } from './crear-galerias.component';

describe('CrearGaleriasComponent', () => {
  let component: CrearGaleriasComponent;
  let fixture: ComponentFixture<CrearGaleriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearGaleriasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearGaleriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
