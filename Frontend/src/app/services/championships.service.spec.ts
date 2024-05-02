import { TestBed } from '@angular/core/testing';

import { ChampionshipsService } from '../championships.service';

describe('ChampionshipsService', () => {
  let service: ChampionshipsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChampionshipsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
