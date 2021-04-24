import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScraperDataComponent } from './scraper-data.component';

describe('ScraperDataComponent', () => {
  let component: ScraperDataComponent;
  let fixture: ComponentFixture<ScraperDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScraperDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScraperDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
