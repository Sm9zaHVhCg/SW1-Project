import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {TitleCasePipe} from '@angular/common';
import {ConfigService} from '../config.service';

@Component({
  selector: 'app-word-suggestion',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    RouterModule,
    TitleCasePipe
  ],
  templateUrl: './word-suggestion.html',
  styleUrls: ['./word-suggestion.css']
})
export class WordSuggestion implements OnInit {

  word: string = '';
  definition: string = '';
  topic: string = '';

  topics: string[] = [];
  suggestions: any[] = [];
  successMessage: string = '';

  // Validation flags
  wordError = false;
  definitionError = false;
  topicError = false;

  constructor(private http: HttpClient, private config: ConfigService) {
  }

  ngOnInit() {
    this.http.get<string[]>(`${this.config.apiUrl}/word/topics`).subscribe({
      next: (data) => this.topics = data,
      error: () => console.error('Failed to load topics')
    });
  }

  submitWord() {
    // Reset validation flags
    this.wordError = !this.word.trim();
    this.definitionError = !this.definition.trim();
    this.topicError = !this.topic.trim();

    // Stop submission if invalid
    if (this.wordError || this.definitionError || this.topicError) {
      return;
    }

    // Build request body matching backend format
    const wordData = {
      wordTitle: this.word.trim(),
      wordDescription: this.definition.trim(),
      topic: this.topic.trim()
    };

    this.http.post('http://localhost:8080/word/new-suggestion', wordData)
      .subscribe(() => {
        // Reset form fields
        this.word = '';
        this.definition = '';
        this.topic = '';

        // Show success message
        this.successMessage = 'Word submitted successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      });
  }
}
