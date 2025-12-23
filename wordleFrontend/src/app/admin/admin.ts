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
  selectedMajor = '';
  searchApproved = '';
  searchSuggested = '';
  filteredApprovedWords: any[] = [];
  filteredSuggestedWords: any[] = [];

  // -------------------- Form State --------------------
  newMajor = '';
  editingMajor: string | null = null;

  newWord: any = { word: '', studyProgram: '', role: '', definition: '' };
  newWordError = { word: false, studyProgram: false, role: false, definition: false };

  editWordModal = false;
  editingWord: any = null;
  editWordError = { word: false, studyProgram: false, role: false, definition: false };

  showAddWordModal = false;
  successMessage = '';

  constructor(private http?: HttpClient) {}

  ngOnInit() {
    this.refreshFilteredWords();
  }

  // -------------------- Majors --------------------
  addMajor() {
    const trimmed = this.newMajor.trim();
    if (!trimmed) return;
    if (!this.validateMajor(trimmed)) return;

    if (this.editingMajor !== null) {
      // Edit existing major
      const index = this.majors.indexOf(this.editingMajor);
      if (index >= 0) this.majors[index] = trimmed;
      this.editingMajor = null;
      this.showSuccess('Major updated successfully!');
      // backendStub_updateMajor(this.editingMajor, trimmed);
    } else {
      this.majors.push(trimmed);
      this.showSuccess('Major added successfully!');
      // backendStub_addMajor(trimmed);
    }
    this.newMajor = '';
  }

  editMajor(major: string) {
    this.editingMajor = major;
    this.newMajor = major;
  }

  deleteMajor(major: string) {
    this.majors = this.majors.filter(m => m !== major);
    this.showSuccess('Major deleted!');
    // backendStub_deleteMajor(major);
  }

  validateMajor(major: string): boolean {
    return !!major.trim();
  }

  // -------------------- Words --------------------
  addApprovedWord(): boolean {
    this.resetWordErrors(this.newWord, this.newWordError);
    if (Object.values(this.newWordError).some(e => e)) return false;

    this.approvedWords.push({ ...this.newWord, id: Date.now() });
    this.newWord = { word: '', studyProgram: '', role: '', definition: '' };
    this.showSuccess('Word added successfully!');
    this.refreshFilteredWords();
    return true;
  }

  openAddWordModal() {
    this.showAddWordModal = true;

    // Reset form values
    this.newWord = { word: '', studyProgram: '', role: '', definition: '' };

    // Reset error states
    this.newWordError = { word: false, studyProgram: false, role: false, definition: false };
  }

  openEditWord(word: any) {
    this.editWordModal = true;
    this.editingWord = { ...word };
  }

  saveEditedWord() {
    if (!this.editingWord) return;
    this.resetWordErrors(this.editingWord, this.editWordError);
    if (Object.values(this.editWordError).some(e => e)) return;

    const index = this.approvedWords.findIndex(w => w.id === this.editingWord.id);
    if (index >= 0) this.approvedWords[index] = { ...this.editingWord };

    this.editingWord = null;
    this.editWordModal = false;
    this.showSuccess('Word updated successfully!');
    this.refreshFilteredWords();
  }
  approveWord(word: any) {
    this.approvedWords.unshift(word);
    this.suggestedWords = this.suggestedWords.filter(w => w.id !== word.id);
    this.refreshFilteredWords();
    this.refreshFilteredSuggested();
    this.showSuccess('Word approved!');
  }

  deleteWord(word: any) {
    this.approvedWords = this.approvedWords.filter(w => w.id !== word.id);
    this.refreshFilteredWords();
  }

  deleteSuggestedWord(word: any) {
    this.suggestedWords = this.suggestedWords.filter(w => w.id !== word.id);
    this.refreshFilteredSuggested();
  }

  // -------------------- Search/Filter --------------------
  searchApprovedWords() { this.refreshFilteredWords(); }
  searchSuggestedWords() { this.refreshFilteredSuggested(); }

  private refreshFilteredWords() {
    this.filteredApprovedWords = this.approvedWords.filter(word =>
      (!this.selectedMajor || word.studyProgram === this.selectedMajor) &&
      (!this.searchApproved || word.word.toLowerCase().includes(this.searchApproved.toLowerCase()))
    );
  }

  private refreshFilteredSuggested() {
    this.filteredSuggestedWords = this.suggestedWords.filter(word =>
      !this.searchSuggested || word.word.toLowerCase().includes(this.searchSuggested.toLowerCase())
    );
  }

  // -------------------- Validation --------------------
  private resetWordErrors(word: any, errors: any) {
    errors.word = !word.word?.trim() || /[^a-zA-Z]/.test(word.word);
    errors.studyProgram = !word.studyProgram?.trim();
    errors.role = !word.role?.trim();
    errors.definition = !word.definition?.trim();
  }

  // -------------------- Helper --------------------
  private showSuccess(message: string, duration = 3000) {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', duration);
  }

  // -------------------- Backend stubs --------------------
  // Replace these with actual HTTP requests later
  backendStub_addMajor(name: string) {}
  backendStub_updateMajor(oldName: string, newName: string) {}
  backendStub_deleteMajor(name: string) {}
  backendStub_addWord(word: any) {}
  backendStub_updateWord(word: any) {}
  backendStub_deleteWord(wordId: number) {}
}
