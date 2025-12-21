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
  role: string = '';
  studiengang: string = '';
  definition: string = '';

  suggestions: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadSuggestions();
  }

  loadSuggestions() {
    this.http.get<any[]>('http://localhost:8080/words')
      .subscribe(data => {
        this.suggestions = data; // Anzeige aller Vorschläge
      });
  }
  

  studyProgram: string = '';

  submitWord() {
    const wordData = {
      word: this.word.toLowerCase(),
      role: this.role,
      studyProgram: this.studyProgram,
      definition: this.definition
    };

    this.http.post('http://localhost:8080/words', wordData)
      .subscribe(() => {
        this.word = '';
        this.role = 'STUDENT';
        this.studyProgram = '';
        this.definition = '';
        this.loadSuggestions();
      });
  }

  
}
