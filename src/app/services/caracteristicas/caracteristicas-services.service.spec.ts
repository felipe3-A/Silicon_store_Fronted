import { TestBed } from '@angular/core/testing';

import { CaracteristicasServicesService } from './caracteristicas-services.service';

describe('CaracteristicasServicesService', () => {
  let service: CaracteristicasServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaracteristicasServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
