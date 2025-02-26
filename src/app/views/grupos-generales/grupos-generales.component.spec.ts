import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposGeneralesComponent } from './grupos-generales.component';

describe('GruposGeneralesComponent', () => {
  let component: GruposGeneralesComponent;
  let fixture: ComponentFixture<GruposGeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GruposGeneralesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GruposGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
