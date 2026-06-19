import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLayoutComponent } from './all-layout.component';

describe('AllLayoutComponent', () => {
  let component: AllLayoutComponent;
  let fixture: ComponentFixture<AllLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
