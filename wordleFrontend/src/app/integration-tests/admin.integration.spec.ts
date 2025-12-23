import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Admin } from '../admin/admin';

describe('Admin Integration Tests', () => {
  let component: Admin;
  let fixture: ComponentFixture<Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, Admin]
    }).compileComponents();

    fixture = TestBed.createComponent(Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should add a new major via public method', () => {
    component.newMajor = 'Mechanical Engineering';
    component.addMajor(); // public method
    expect(component.majors).toContain('Mechanical Engineering');
  });

  it('should edit an existing major', () => {
    component.editMajor('Computer Science'); // sets editingMajor
    component.newMajor = 'CompSci';
    component.addMajor(); // public method triggers update
    expect(component.majors).toContain('CompSci');
    expect(component.majors).not.toContain('Computer Science');
  });

  it('should add an approved word', () => {
    component.newWord = {
      word: 'TestWord',
      studyProgram: 'Computer Science',
      role: 'Student',
      definition: 'A word for testing'
    };
    const result = component.addApprovedWord(); // public method
    expect(result).toBeTrue();
    expect(component.approvedWords.some(w => w.word === 'TestWord')).toBeTrue();
  });

  it('should approve a suggested word', () => {
    const suggested = { id: 999, word: 'Suggested', studyProgram: 'CS', role: 'Student', definition: 'Demo' };
    component.suggestedWords = [suggested];
    component.approveWord(suggested); // public method
    expect(component.approvedWords).toContain(suggested);
    expect(component.suggestedWords).not.toContain(suggested);
  });

  it('should filter approved words via search', () => {
    component.approvedWords = [
      { id: 1, word: 'Angular', studyProgram: 'CS', role: 'Student', definition: 'Framework' },
      { id: 2, word: 'React', studyProgram: 'CS', role: 'Student', definition: 'Library' }
    ];
    component.searchApproved = 'Angular';
    component.searchApprovedWords(); // public method calls private filtering
    expect(component.filteredApprovedWords.length).toBe(1);
    expect(component.filteredApprovedWords[0].word).toBe('Angular');
  });

  it('should filter suggested words via search', () => {
    component.suggestedWords = [
      { id: 1, word: 'Wordle', studyProgram: 'BI', role: 'Lecturer', definition: 'Game' },
      { id: 2, word: 'Puzzle', studyProgram: 'BI', role: 'Lecturer', definition: 'Game' }
    ];
    component.searchSuggested = 'Puzzle';
    component.searchSuggestedWords(); // public method calls private filtering
    expect(component.filteredSuggestedWords.length).toBe(1);
    expect(component.filteredSuggestedWords[0].word).toBe('Puzzle');
  });
});
