import { TestBed } from '@angular/core/testing';

import { SubCaracteristicasServicesService } from './sub-caracteristicas-services.service';

describe('SubCaracteristicasServicesService', () => {
  let service: SubCaracteristicasServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubCaracteristicasServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
