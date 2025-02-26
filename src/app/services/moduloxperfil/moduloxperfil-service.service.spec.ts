import { TestBed } from '@angular/core/testing';

import { ModuloxperfilServiceService } from './moduloxperfil-service.service';

describe('ModuloxperfilServiceService', () => {
  let service: ModuloxperfilServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuloxperfilServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
