import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarResultadosComponent } from './ingresar-resultados.component';

describe('IngresarResultadosComponent', () => {
  let component: IngresarResultadosComponent;
  let fixture: ComponentFixture<IngresarResultadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresarResultadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IngresarResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
