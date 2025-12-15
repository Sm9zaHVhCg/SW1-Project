import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-word-suggestion',
  standalone: true,
  imports: [
    CommonModule,FormsModule, HttpClientModule, RouterModule],  
  templateUrl: './word-suggestion.html',
  styleUrls: ['./word-suggestion.css']
})
export class WordSuggestion {

  word: string = '';
  role: string = 'student';
  definition: string = '';

  suggestions: any[] = [];

  constructor(private http: HttpClient) {}

  loadSuggestions() {
    this.http.get<any[]>('http://localhost:8080/words')
      .subscribe(data => {
        this.suggestions = data.filter(w =>
          w.word.startsWith(this.word.toLowerCase())
        );
      });
  }

  saveWord() {
    const newWord = {
      word: this.word.toLowerCase(),
      role: this.role,
      definition: this.definition
    };

    this.http.post('http://localhost:8080/words', newWord)
      .subscribe(() => {
        this.word = '';
        this.definition = '';
        this.loadSuggestions();
      });
  }
}
