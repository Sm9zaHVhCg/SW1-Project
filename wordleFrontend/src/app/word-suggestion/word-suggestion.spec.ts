import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordSuggestion } from './word-suggestion';

describe('WordSuggestion', () => {
  let component: WordSuggestion;
  let fixture: ComponentFixture<WordSuggestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordSuggestion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordSuggestion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
