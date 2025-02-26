import { TestBed } from '@angular/core/testing';

import { GrupoServiceService } from './grupo-service.service';

describe('GrupoServiceService', () => {
  let service: GrupoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrupoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
