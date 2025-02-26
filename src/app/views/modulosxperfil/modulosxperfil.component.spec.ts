import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulosxperfilComponent } from './modulosxperfil.component';

describe('ModulosxperfilComponent', () => {
  let component: ModulosxperfilComponent;
  let fixture: ComponentFixture<ModulosxperfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModulosxperfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModulosxperfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
