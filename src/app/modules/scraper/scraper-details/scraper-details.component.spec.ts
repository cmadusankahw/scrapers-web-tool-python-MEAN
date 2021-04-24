import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScraperDetailsComponent } from './scraper-details.component';

describe('ScraperDetailsComponent', () => {
  let component: ScraperDetailsComponent;
  let fixture: ComponentFixture<ScraperDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScraperDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScraperDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
