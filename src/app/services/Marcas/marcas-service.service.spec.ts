import { TestBed } from '@angular/core/testing';

import { MarcasServiceService } from './marcas-service.service';

describe('MarcasServiceService', () => {
  let service: MarcasServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarcasServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
