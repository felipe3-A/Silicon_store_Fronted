import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearValoresComponent } from './crear-valores.component';

describe('CrearValoresComponent', () => {
  let component: CrearValoresComponent;
  let fixture: ComponentFixture<CrearValoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearValoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearValoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
