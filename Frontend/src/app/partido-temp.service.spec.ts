import { TestBed } from '@angular/core/testing';

import { PartidoTempService } from './partido-temp.service';

describe('PartidoTempService', () => {
  let service: PartidoTempService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartidoTempService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
