import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCampeonatoComponent } from './crear-campeonato.component';

describe('CrearCampeonatoComponent', () => {
  let component: CrearCampeonatoComponent;
  let fixture: ComponentFixture<CrearCampeonatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearCampeonatoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearCampeonatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
