import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadosComboComponent } from './estados-combo.component';

describe('EstadosComboComponent', () => {
  let component: EstadosComboComponent;
  let fixture: ComponentFixture<EstadosComboComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadosComboComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadosComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
