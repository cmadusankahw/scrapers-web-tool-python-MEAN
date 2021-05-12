import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminScraperDetailsComponent } from './admin-scraper-details.component';

describe('AdminScraperDetailsComponent', () => {
  let component: AdminScraperDetailsComponent;
  let fixture: ComponentFixture<AdminScraperDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminScraperDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminScraperDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
