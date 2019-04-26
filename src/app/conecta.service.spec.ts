import { TestBed } from '@angular/core/testing';

import { ConectaService } from './conecta.service';

describe('ConectaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConectaService = TestBed.get(ConectaService);
    expect(service).toBeTruthy();
  });
});
