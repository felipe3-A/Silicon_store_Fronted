import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VermisPerdiosComponent } from './vermis-perdios.component';

describe('VermisPerdiosComponent', () => {
  let component: VermisPerdiosComponent;
  let fixture: ComponentFixture<VermisPerdiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VermisPerdiosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VermisPerdiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
