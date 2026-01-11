import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {TitleCasePipe} from '@angular/common';
import {ConfigService} from '../config.service';

@Component({
  selector: 'admin',
  templateUrl: './admin.html',
  imports: [FormsModule, HttpClientModule, TitleCasePipe],
  styleUrls: ['./admin.css']
})


export class Admin implements OnInit {

  majors: string[] = [];
  approvedWords: WordEntry[] = [];
  suggestedWords: WordEntry[] = [];

  // -------------------- Filtering/Search --------------------
  selectedMajor = '';
  searchApproved = '';
  searchSuggested = '';
  filteredApprovedWords: any[] = [];
  filteredSuggestedWords: any[] = [];

  // -------------------- Form State --------------------
  newMajor = '';
  editingMajor: string | null = null;

  newWord: WordEntry = {
    wordId: 0,
    wordTitle: '',
    wordDescription: '',
    topic: '',
    wordStatus: 'AVAILABLE',
    lastUsed: ''
  };

  newWordError = {wordTitle: false, wordDescription: false, topic: false};

  editWordModal = false;
  editingWord: any = null;
  editWordError = {word: false, studyProgram: false, role: false, definition: false};

  showAddWordModal = false;
  successMessage = '';

  constructor(private http: HttpClient, private  config: ConfigService) {
  }

  ngOnInit() {
    this.loadApprovedWords();
    this.loadSuggestedWords();

    this.http.get<string[]>(`${this.config.apiUrl}/word/topics`).subscribe({
      next: (data) => this.majors = data,
      error: () => console.error('Failed to load categories')
    });
  }

  loadApprovedWords() {
    this.http.get<WordEntry[]>(`${this.config.apiUrl}/admin/word-edit/approved`)
      .subscribe({
        next: (data) => {
          this.approvedWords = data;
          this.refreshFilteredWords();
        },
        error: () => console.error('Failed to load approved words')
      });
  }

  loadSuggestedWords() {
    this.http.get<WordEntry[]>(`${this.config.apiUrl}/admin/word-edit/suggested`)
      .subscribe({
        next: (data) => {
          this.suggestedWords = data;
          this.refreshFilteredSuggested();
        },
        error: () => console.error('Failed to load suggested words')
      });
  }

  deleteWord(word: WordEntry) {
    this.http.delete(`${this.config.apiUrl}/admin/word-edit/${word.wordId}/delete`, { responseType: 'text'})
      .subscribe({
        next: () => {
          // Remove from UI
          this.showSuccess('Word deleted successfully!');
          this.loadApprovedWords();
        },
        error: () => console.error('Failed to delete word')
      });
  }

  deleteSuggestedWord(word: WordEntry) {
    this.http.delete(
      `${this.config.apiUrl}/admin/word-edit/${word.wordId}/delete`,{ responseType: 'text'}
    )
      .subscribe({
        next: () => {
          this.showSuccess('Word deleted successfully!');
          this.loadSuggestedWords();
        }, error: err => console.error(err)
      });
  }


  // -------------------- Words --------------------
  addApprovedWord(): boolean {
    this.resetWordErrors(this.newWord, this.newWordError);
    if (Object.values(this.newWordError).some(e => e)) return false;

    const body = {
      wordTitle: this.newWord.wordTitle,
      wordDescription: this.newWord.wordDescription,
      wordStatus: "AVAILABLE",
      topic: this.newWord.topic
    };

    this.http.post(`${this.config.apiUrl}/admin/word-edit/new`, body)
      .subscribe({
        next: () => {
          this.showSuccess('Word added successfully!');
          this.showAddWordModal = false;

          // Reload from backend
          this.loadApprovedWords();

          // Reset form
          this.newWord = {
            wordId: 0,
            wordTitle: '',
            wordDescription: '',
            topic: '',
            wordStatus: 'AVAILABLE',
            lastUsed: ''
          };
        },
        error: () => console.error('Failed to add new word')
      });

    return true;
  }

  openAddWordModal() {
    this.showAddWordModal = true;
  }

  openEditWord(word: any) {
    this.editWordModal = true;
    this.editingWord = {...word};
  }

  saveEditedWord() {
    if (!this.editingWord) return;

    this.resetWordErrors(this.editingWord, this.editWordError);
    if (Object.values(this.editWordError).some(e => e)) return;

    const id = this.editingWord.wordId;

    const body = {
      wordTitle: this.editingWord.wordTitle,
      wordDescription: this.editingWord.wordDescription,
      topic: this.editingWord.topic
    };

    this.http.patch(`${this.config.apiUrl}/admin/word-edit/${id}/edit`, body)
      .subscribe({
        next: () => {
          // Update UI
          const index = this.approvedWords.findIndex(w => w.wordId === id);
          if (index >= 0) {
            this.approvedWords[index] = {...this.editingWord};
          }

          this.editingWord = null;
          this.editWordModal = false;
          this.showSuccess('Word updated successfully!');
          this.refreshFilteredWords();
        },
        error: () => console.error('Failed to update word')
      });
  }

  approveWord(word: WordEntry) {
    this.http.patch(`${this.config.apiUrl}/admin/word-edit/${word.wordId}/verify`, {})
      .subscribe({
        next: () => {
          // Move word from suggested → approved
          this.approvedWords.unshift(word);
          this.suggestedWords = this.suggestedWords.filter(w => w.wordId !== word.wordId);

          this.refreshFilteredWords();
          this.refreshFilteredSuggested();
          this.showSuccess('Word approved!');
        },
        error: () => console.error('Failed to approve word')
      });
  }


  // -------------------- Search/Filter --------------------
  searchApprovedWords() {
    this.refreshFilteredWords();
  }

  searchSuggestedWords() {
    this.refreshFilteredSuggested();
  }

  protected refreshFilteredWords() {
    this.filteredApprovedWords = this.approvedWords.filter(word =>
      (!this.selectedMajor || word.topic === this.selectedMajor) &&
      (!this.searchApproved || word.wordTitle.toLowerCase().includes(this.searchApproved.toLowerCase()))
    );
  }

  private refreshFilteredSuggested() {
    this.filteredSuggestedWords = this.suggestedWords.filter(word =>
      !this.searchSuggested || word.wordTitle.toLowerCase().includes(this.searchSuggested.toLowerCase())
    );
  }

  // -------------------- Validation --------------------
  private resetWordErrors(word: WordEntry, errors: any) {
    errors.wordTitle = !word.wordTitle?.trim();
    errors.wordDescription = !word.wordDescription?.trim();
    errors.topic = !word.topic?.trim();
  }

  // -------------------- Helper --------------------
  private showSuccess(message: string, duration = 3000) {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', duration);
  }
}

interface WordEntry {
  wordId: number;
  wordTitle: string;
  wordDescription: string;
  topic: string;
  wordStatus: string;
  lastUsed: string;
}
