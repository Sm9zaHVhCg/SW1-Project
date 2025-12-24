import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { WordSuggestion } from './word-suggestion';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WordSuggestion Component', () => {
  let component: WordSuggestion;
  let fixture: ComponentFixture<WordSuggestion>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, WordSuggestion]
    }).compileComponents();

    fixture = TestBed.createComponent(WordSuggestion);
    component = fixture.componentInstance;
  });

  it('should validate form and prevent submission if empty', () => {
    component.word = '';
    component.role = '';
    component.studyProgram = '';
    component.definition = '';
    component.submitWord();
    expect(component.wordError).toBeTrue();
    expect(component.roleError).toBeTrue();
    expect(component.studyProgramError).toBeTrue();
    expect(component.definitionError).toBeTrue();
  });

  it('should submit word successfully', fakeAsync(() => {
    component.word = 'TEST';
    component.role = 'Student';
    component.studyProgram = 'CS';
    component.definition = 'Definition';
    component.submitWord();
    tick(500);
    expect(component.successMessage).toBe('Word submitted successfully!');
    expect(component.suggestions[0].word).toBe('test');
  }));

  it('should clear success message after 3s', fakeAsync(() => {
    component.word = 'TEST';
    component.role = 'Student';
    component.studyProgram = 'CS';
    component.definition = 'Definition';
    component.submitWord();
    tick(500);
    expect(component.successMessage).toBe('Word submitted successfully!');
    tick(3000);
    expect(component.successMessage).toBe('');
  }));
});
