import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministarUsuarioComponent } from './administar-usuario.component';

describe('AdministarUsuarioComponent', () => {
  let component: AdministarUsuarioComponent;
  let fixture: ComponentFixture<AdministarUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministarUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
