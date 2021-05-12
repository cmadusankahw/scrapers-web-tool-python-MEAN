import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashUpdatedDataComponent } from './dash-updated-data.component';

describe('DashUpdatedDataComponent', () => {
  let component: DashUpdatedDataComponent;
  let fixture: ComponentFixture<DashUpdatedDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashUpdatedDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashUpdatedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
