import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Admin } from './admin';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Admin Component', () => {
  let component: Admin;
  let fixture: ComponentFixture<Admin>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, Admin]
    }).compileComponents();

    fixture = TestBed.createComponent(Admin);
    component = fixture.componentInstance;
    component.ngOnInit();
  });
  /* manipulating major via admin page not in scope
  it('should add a new major', () => {
    component.newMajor = 'Mathematics';
    component.addMajor();
    expect(component.majors).toContain('Mathematics');
  });

  it('should edit a major', () => {
    component.editMajor('Computer Science');
    component.newMajor = 'CS Updated';
    component.addMajor();
    expect(component.majors).toContain('CS Updated');
    expect(component.majors).not.toContain('Computer Science');
  });

  it('should delete a major', () => {
    component.deleteMajor('Business Informatics');
    expect(component.majors).not.toContain('Business Informatics');
  });
  */

  it('should add approved word when valid', () => {
    component.newWord = { word: 'Test', studyProgram: 'CS', role: 'Student', definition: 'Definition' };
    const result = component.addApprovedWord();
    expect(result).toBeTrue();
    expect(component.approvedWords.some(w => w.word === 'Test')).toBeTrue();
  });

  it('should reject invalid word', () => {
    component.newWord = { word: '', studyProgram: '', role: '', definition: '' };
    const result = component.addApprovedWord();
    expect(result).toBeFalse();
  });

  it('should approve suggested word', () => {
    const word = { id: 3, word: 'Wordle', studyProgram: 'Business Informatics', role: 'Lecturer', definition: 'Word puzzle' };
    component.approveWord(word);
    expect(component.approvedWords).toContain(word);
    expect(component.suggestedWords.some(w => w.id === 3)).toBeFalse();
  });

  it('should filter approved words by major', () => {
    component.selectedMajor = 'Computer Science';
    component.searchApproved = '';
    component.searchApprovedWords();
    expect(component.filteredApprovedWords.every(w => w.studyProgram === 'Computer Science')).toBeTrue();
  });
});
