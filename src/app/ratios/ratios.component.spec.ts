import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatiosComponent } from './ratios.component';

describe('RatiosComponent', () => {
  let component: RatiosComponent;
  let fixture: ComponentFixture<RatiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatiosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
