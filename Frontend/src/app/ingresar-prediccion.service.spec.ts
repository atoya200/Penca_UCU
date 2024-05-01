import { TestBed } from '@angular/core/testing';

import { IngresarPrediccionService } from './ingresar-prediccion.service';

describe('IngresarPrediccionService', () => {
  let service: IngresarPrediccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngresarPrediccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
