import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalInfoComponent } from './country-info.component';

describe('LocalInfoComponent', () => {
  let component: LocalInfoComponent;
  let fixture: ComponentFixture<LocalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
