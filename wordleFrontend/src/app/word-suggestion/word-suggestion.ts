import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-word-suggestion',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    RouterModule
],
  templateUrl: './word-suggestion.html',
  styleUrls: ['./word-suggestion.css']
})

export class WordSuggestion {
  word: string = '';
  role: string = '';
  studyProgram: string = '';
  definition: string = '';

  suggestions: any[] = [];

  successMessage: string = '';

  // Validation flags
  wordError = false;
  roleError = false;
  studyProgramError = false;
  definitionError = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadSuggestions();
  }

  loadSuggestions() {
    this.http.get<any[]>('http://localhost:8080/words')
      .subscribe(data => {
        this.suggestions = data;
      });
  }

  submitWord() {
    // Reset errors
    this.wordError = !this.word.trim();
    this.roleError = !this.role.trim();
    this.studyProgramError = !this.studyProgram.trim();
    this.definitionError = !this.definition.trim();

    // Stop submission if any field is invalid
    if (this.wordError || this.roleError || this.studyProgramError || this.definitionError) {
      return;
    }

    const wordData = {
      word: this.word.toLowerCase(),
      role: this.role,
      studyProgram: this.studyProgram,
      definition: this.definition
    };

    // MOCK submission
    setTimeout(() => {
      // Reset form fields
      this.word = '';
      this.role = '';
      this.studyProgram = '';
      this.definition = '';

      // Show success message
      this.successMessage = 'Word submitted successfully!';
      setTimeout(() => this.successMessage = '', 3000); // hide after 3s

      // Add to local suggestions so you see it "appear"
      this.suggestions.unshift(wordData);
    }, 500); // mimic 500ms network delay

    /* Actual submit post
    this.http.post('http://localhost:8080/words', wordData)
      .subscribe(() => {
        // Reset form fields
        this.word = '';
        this.role = '';
        this.studyProgram = '';
        this.definition = '';

        // Show success message
        this.successMessage = 'Word submitted successfully!';
        setTimeout(() => this.successMessage = '', 3000); // hide after 3s

        // Reload suggestions
        this.loadSuggestions();
      });
    */
  }
}
