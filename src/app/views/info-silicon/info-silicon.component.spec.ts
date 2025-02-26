import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSiliconComponent } from './info-silicon.component';

describe('InfoSiliconComponent', () => {
  let component: InfoSiliconComponent;
  let fixture: ComponentFixture<InfoSiliconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoSiliconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoSiliconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
