import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataInfoFormComponent } from './data-info-form.component';

describe('DataInfoFormComponent', () => {
  let component: DataInfoFormComponent;
  let fixture: ComponentFixture<DataInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataInfoFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
