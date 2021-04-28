import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddScraperComponent } from './admin-add-scraper.component';

describe('AdminAddScraperComponent', () => {
  let component: AdminAddScraperComponent;
  let fixture: ComponentFixture<AdminAddScraperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAddScraperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAddScraperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
