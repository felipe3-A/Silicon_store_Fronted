import { TestBed } from '@angular/core/testing';

import { ValoresCaracteristicasServicesService } from './valores-caracteristicas-services.service';

describe('ValoresCaracteristicasServicesService', () => {
  let service: ValoresCaracteristicasServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValoresCaracteristicasServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
