import { TestBed } from '@angular/core/testing';

import { ModuloServiceService } from './modulo-service.service';

describe('ModuloServiceService', () => {
  let service: ModuloServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuloServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
