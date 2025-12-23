import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'admin',
  templateUrl: './admin.html',
  imports: [FormsModule, HttpClientModule],
  styleUrls: ['./admin.css']
})
export class Admin {

  // -------------------- Mock Data --------------------
  majors: string[] = ['Computer Science', 'Business Informatics', 'Electrical Engineering'];

  approvedWords: any[] = [
    { id: 1, word: 'Angular', studyProgram: 'Computer Science', role: 'Student', definition: 'Frontend framework' },
    { id: 2, word: 'TypeScript', studyProgram: 'Computer Science', role: 'Student', definition: 'JS superset' }
  ];

  suggestedWords: any[] = [
    { id: 3, word: 'Wordle', studyProgram: 'Business Informatics', role: 'Lecturer', definition: 'Word puzzle game' }
  ];

  // -------------------- Filtering/Search --------------------
  selectedMajor: string = '';
  searchApproved: string = '';
  searchSuggested: string = '';

  filteredApprovedWords: any[] = [];
  filteredSuggestedWords: any[] = [];

  // -------------------- Form State --------------------
  newMajor: string = '';
  newWord: any = { word: '', studyProgram: '', role: '', definition: '' };
  newWordError = {
    word: false,
    studyProgram: false,
    role: false,
    definition: false
  };

  editWordModal: boolean = false;
  editingWord: any = null;
  editWordError = {
    word: false,
    studyProgram: false,
    role: false,
    definition: false
  };

  showAddWordModal: boolean = false;

  successMessage: string = '';

  constructor(private http?: HttpClient) {
    // HttpClient optional for backend integration
  }

  ngOnInit() {
    this.filteredApprovedWords = [...this.approvedWords];
    this.filteredSuggestedWords = [...this.suggestedWords];
  }

  // -------------------- Majors --------------------
  addMajor() {
    const trimmed = this.newMajor.trim();
    if (!trimmed) return;

    this.majors.push(trimmed);
    this.newMajor = '';

    // For backend:
    // this.http.post('http://localhost:8080/majors', { name: trimmed }).subscribe(() => this.loadMajors());
  }

  deleteMajor(major: string) {
    this.majors = this.majors.filter(m => m !== major);

    // For backend:
    // this.http.delete(`http://localhost:8080/majors/${major}`).subscribe(() => this.loadMajors());
  }

  // -------------------- Words --------------------
  addApprovedWord(): boolean {
    // Reset errors
    this.newWordError.word = !this.newWord.word?.trim();
    this.newWordError.studyProgram = !this.newWord.studyProgram?.trim();
    this.newWordError.role = !this.newWord.role?.trim();
    this.newWordError.definition = !this.newWord.definition?.trim();

    // Stop if any error
    if (Object.values(this.newWordError).some(e => e)) return false;

    this.approvedWords.push({ ...this.newWord, id: Date.now() });
    this.newWord = { word: '', studyProgram: '', role: '', definition: '' };
    this.showSuccess('Word added successfully!');

    this.searchApprovedWords();

    return true;
  }

  openEditWord(word: any) {
    this.editWordModal = true;
    this.editingWord = { ...word }; // clone
  }

  saveEditedWord() {
    if (!this.editingWord) return;

    // Reset errors
    this.editWordError.word = !this.editingWord.word?.trim();
    this.editWordError.studyProgram = !this.editingWord.studyProgram?.trim();
    this.editWordError.role = !this.editingWord.role?.trim();
    this.editWordError.definition = !this.editingWord.definition?.trim();

    if (Object.values(this.editWordError).some(e => e)) return;

    const index = this.approvedWords.findIndex(w => w.id === this.editingWord.id);
    if (index >= 0) this.approvedWords[index] = { ...this.editingWord };

    this.editingWord = null;
    this.editWordModal = false;
    this.showSuccess('Word updated successfully!');

    this.searchApprovedWords();
  }

  cancelEdit() {
    this.editingWord = null;
    this.editWordModal = false;
  }

  approveWord(word: any) {
    this.approvedWords.unshift(word);
    this.suggestedWords = this.suggestedWords.filter(w => w.id !== word.id);
    this.searchSuggestedWords(); // refresh filtered list
    this.showSuccess('Word approved!');
  }

  deleteWord(word: any) {
    this.approvedWords = this.approvedWords.filter(w => w.id !== word.id);
    this.searchApprovedWords(); // refresh filtered list
  }

  deleteSuggestedWord(word: any) {
    this.suggestedWords = this.suggestedWords.filter(w => w.id !== word.id);
    this.searchSuggestedWords(); // refresh filtered list
  }

  // -------------------- Search/Filter --------------------
  searchApprovedWords() {
    this.filteredApprovedWords = this.approvedWords.filter(word =>
      (!this.selectedMajor || word.studyProgram === this.selectedMajor) &&
      (!this.searchApproved || word.word.toLowerCase().includes(this.searchApproved.toLowerCase()))
    );
  }

  searchSuggestedWords() {
    this.filteredSuggestedWords = this.suggestedWords.filter(word =>
      !this.searchSuggested || word.word.toLowerCase().includes(this.searchSuggested.toLowerCase())
    );
  }

  // -------------------- Helper --------------------
  private showSuccess(message: string, duration: number = 3000) {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', duration);
  }

  // -------------------- Backend integration --------------------
  // loadMajors() { ... }
  // loadWords() { ... }
}
