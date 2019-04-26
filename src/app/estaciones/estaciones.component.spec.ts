import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstacionesComponent } from './estaciones.component';

describe('EstacionesComponent', () => {
  let component: EstacionesComponent;
  let fixture: ComponentFixture<EstacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
