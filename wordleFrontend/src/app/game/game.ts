import {Component, HostListener} from '@angular/core';
import {DecimalPipe, NgClass} from '@angular/common';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { of } from 'rxjs';//For testing

// For the tiles
interface Box {
  letter: string;//which letter it is
  color: string;//what color it is
  flip: boolean;
  pop: boolean;
  revealed: boolean;
}

//For the leaderboard + results popup
interface Stats {
  attempts: number;
  won: boolean;
  timeTaken?: number;
}

const GUESS_LIMIT = 6;

@Component({
  selector: 'app-game',
  imports: [
    NgClass,
    DecimalPipe,
    HttpClientModule,
  ],
  templateUrl: './game.html',
  styleUrls: ['./game.css'],
})


export class Game {
  word = ''; //Check if word is correctly formatted else lowercase makes issues
  wordLength = 0;
  guesses: Box[][] = [];//Guesses are made up of an 2D array of boxes
  currGuess = 0; //Current guess of GUESS_LIMIT
  currLetter = 0; //Current letter of guess

  // Keyboard render
  top = 'QWERTZUIOPÜ'.split('');
  middle = 'ASDFGHJKLÖÄ'.split('');
  bottom = 'YXCVBNM'.split('');

  // Game flow states
  showCategoryModal = true;
  resultsPopup = false;
  message = '';
  stats: Stats = { attempts: 0, won: false, timeTaken: 0 };
  leaderboard: { name: string; attempts: number; timeTaken: number }[] = [];

  tab: 'me' | 'board' = 'me';
  startTime!: number;

  constructor(private http: HttpClient) {
  }

  //selecting categories
  categorySelected(category: string) {
    this.word = this.getWord(category).toUpperCase();
    this.wordLength = this.word.length;
    this.initGuesses();
    this.showCategoryModal = false;

    this.startTime = Date.now(); //start timer for game after selecting category
  }

  getWord(category: string): string {
    const wordsByCategory: Record<string, string[]> = {
      sports: ['VERSTAPPEN', 'MESSI', 'LEBRON'],
      cars: ['MERCEDES', 'FERRARI', 'TESLA'],
      animals: ['ELEPHANT', 'GIRAFFE', 'KANGAROO'],
    };
    const words = wordsByCategory[category] || ['PLACEHOLDER'];
    return words[Math.floor(Math.random() * words.length)];
  }

  initGuesses() {
    this.guesses = [];
    for (let j = 0; j < GUESS_LIMIT; j++) {
      const attempt: Box[] = [];
      for (let i = 0; i < this.wordLength; i++) {
        attempt.push({ letter: '', color: '', flip: false, pop: false, revealed: false });
      }
      this.guesses.push(attempt);
    }
    this.currGuess = 0;
    this.currLetter = 0;
    this.message = '';
  }

  // Using the keyboard instead of clicking
  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    const key = event.key.toUpperCase();

    if (key === 'ENTER') {
      this.enterClicked();
    } else if (key === 'BACKSPACE') {
      this.deleteClicked();
    } else if (/^[A-ZÄÖÜ]$/.test(key)) {
      this.letterClicked(key);
    }
  }

  //Logic for when letters are clicked on the website to make guesses
  letterClicked(letter: string) {
    if (this.currLetter >= this.wordLength) {
      return; //Out of bounds, End of word reached
    }
    const box = this.guesses[this.currGuess][this.currLetter];
    box.letter = letter;
    box.pop = true;

    setTimeout(() => box.pop = false, 100);
    this.currLetter++;
  }

  // When deleting letters
  deleteClicked() {
    if  (this.currLetter === 0){
      return;
    }
    this.currLetter--;
    const box = this.guesses[this.currGuess][this.currLetter];
    box.letter = '';
    box.color = '';
  }

  // Entering a guess
  enterClicked() {
    let greenCount = 0;
    const submissionTime = Date.now(); //take time

    if(this.currLetter < this.wordLength){
      this.message = 'Your answer is too short';
      return;
    }
    this.message = '';

    const answer = this.guesses[this.currGuess]; //Current answer to be checked
    const answerCheck = Array.from(this.word) //For checking the amount of the same letter in the word (relevant for yellow)

    //Make sure it is a real word
    this.isValidWord(answer.map(c => c.letter).join(''));

    //Color in the letters correctly
    for (let i = 0; i < this.wordLength; i++){
      if (answer[i].letter === this.word[i]){
        answerCheck[i] = ''; // Mark off green letters
        answer[i].color = 'green';
        greenCount++;
      }
    }
    for (let i = 0; i < this.wordLength; i++){
      if (answer[i].color === 'green') {
        continue;
      }
      if(answerCheck.includes(answer[i].letter)){
        answerCheck[answerCheck.indexOf(answer[i].letter)] = ''; // Mark off yellow letters
        answer[i].color = 'yellow';
      }
      else{
        answer[i].color = 'gray'
      }
    }
    //Flip animation
    answer.forEach((box, i) => {
      setTimeout(() => {
        box.flip = true;

        // reveal color halfway through flip
        setTimeout(() => {
          box.revealed = true;
        }, 200);

      }, i * 200);
    });

    // Win or Loss check
    if (greenCount === this.wordLength || this.currGuess === GUESS_LIMIT - 1) {
      const flipDuration = (this.wordLength - 1) * 200 + 600;

      setTimeout(() => {
        this.stats = {
          attempts: this.currGuess + 1,
          won: greenCount === this.wordLength,
          timeTaken: submissionTime - this.startTime,
        };

        this.loadLeaderboard();
        this.resultsPopup = true;
      }, flipDuration);

      return;
    }

    //Move onto next guess
    this.currGuess++;
    this.currLetter = 0;
    answer.forEach(box => box.flip = false);
  }

  private isValidWord(s: string) {
    //Checks if a word is real/exists. Right now not implemented and not in scope.
    return true;
  }
  loadLeaderboard() {
    // Mock leaderboard data for testing
    const mockData: { name: string; attempts: number; timeTaken: number }[] = [
      { name: 'Alice', attempts: 3, timeTaken: 45000 },
      { name: 'Bob', attempts: 4, timeTaken: 78000 },
      { name: 'Charlie', attempts: 5, timeTaken: 120000 },
    ];

    of(mockData).subscribe(data => {
      this.leaderboard = data;
    });

    // Later, replace with real HTTP call:
    // this.http.get<{ name: string; attempts: number; timeTaken: number }[]>('/api/leaderboard')
    //   .subscribe(data => this.leaderboard = data);
  }

  closeResults() {
    this.resultsPopup = false;
    this.tab = 'me';
  }

}
