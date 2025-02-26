import { TestBed } from '@angular/core/testing';

import { PublicidadServiceService } from './publicidad-service.service';

describe('PublicidadServiceService', () => {
  let service: PublicidadServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicidadServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
