import {Component, HostListener, OnInit} from '@angular/core';
import {DecimalPipe, NgClass, CommonModule, TitleCasePipe} from '@angular/common';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {of} from 'rxjs';//For testing

//response to fetching the word of the day
interface WordOfTheDayResponse {
  wordId: number;
  wordTitle: string;
  wordDescription: string;
  topic: string;
  wordStatus: string;
  lastUsed: string;
}


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

interface ScoreResponse {
  username: string;
  score: number;
  category: string;
  guesses: number;
}


interface WordInfo {
  word: string;
  definition: string;
  category: string;
}

interface LeaderboardEntry {
  name: string;
  attempts: number;
  timeTaken: number;
  category: string;
  word: string;
}

const GUESS_LIMIT = 6;

@Component({
  selector: 'app-game',
  imports: [
    NgClass,
    DecimalPipe,
    HttpClientModule,
    CommonModule,
    TitleCasePipe
  ],
  templateUrl: './game.html',
  styleUrls: ['./game.css'],
})


export class Game implements OnInit {
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
  categories: string[] = [];
  resultsPopup = false;
  message = '';
  stats: Stats = {attempts: 0, won: false, timeTaken: 0};
  leaderboard: { name: string; attempts: number; timeTaken: number }[] = [];
  leaderboardEnt: LeaderboardEntry[] = [];

  tab: 'me' | 'board' = 'me';
  wordInfo?: WordInfo;
  selectedCategory = '';
  startTime!: number;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get<string[]>('http://localhost:8080/word/topics').subscribe({
      next: (data) => {
        this.categories = data; // enum values as strings
        console.log("Loaded categories:", this.categories);
      }, error: () => {
        console.error('Failed to load categories');
      }
    });
  }

  //selecting categories
  categorySelected(category: string) {
    this.selectedCategory = category;
    //this.word
    this.fetchWordForCategory(category);
    this.wordLength = this.word.length;
    this.initGuesses();
    this.showCategoryModal = false;

    this.startTime = Date.now(); //start timer for game after selecting category
  }

  fetchWordForCategory(category: string): void {
    const apiCategory = category.replace(/_/g, '-');

    this.http.get<WordOfTheDayResponse>(
      `http://localhost:8080/word/getWordOfTheDay?topic=${apiCategory}`
    ).subscribe({
      next: (data) => {
        this.word = data.wordTitle.toUpperCase();
        this.wordLength = this.word.length;

        this.wordInfo = {
          word: data.wordTitle,
          definition: data.wordDescription,
          category: apiCategory
        };

        this.initGuesses();
        this.showCategoryModal = false;
        this.startTime = Date.now();
      },
      error: () => {
        this.message = 'Failed to load word for this category';
      }
    });
  }


  initGuesses() {
    this.guesses = [];
    for (let j = 0; j < GUESS_LIMIT; j++) {
      const attempt: Box[] = [];
      for (let i = 0; i < this.wordLength; i++) {
        attempt.push({letter: '', color: '', flip: false, pop: false, revealed: false});
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
    if (this.currLetter === 0) {
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

    if (this.currLetter < this.wordLength) {
      this.message = 'Your answer is too short';
      return;
    }
    this.message = '';

    const answer = this.guesses[this.currGuess]; //Current answer to be checked
    const answerCheck = Array.from(this.word) //For checking the amount of the same letter in the word (relevant for yellow)

    //Make sure it is a real word
    this.isValidWord(answer.map(c => c.letter).join(''));

    //Color in the letters correctly
    for (let i = 0; i < this.wordLength; i++) {
      if (answer[i].letter === this.word[i]) {
        answerCheck[i] = ''; // Mark off green letters
        answer[i].color = 'green';
        greenCount++;
      }
    }
    for (let i = 0; i < this.wordLength; i++) {
      if (answer[i].color === 'green') {
        continue;
      }
      if (answerCheck.includes(answer[i].letter)) {
        answerCheck[answerCheck.indexOf(answer[i].letter)] = ''; // Mark off yellow letters
        answer[i].color = 'yellow';
      } else {
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

        const username = localStorage.getItem('user') || 'error_user';
        const score = this.stats.timeTaken ?? 0;

        this.saveScore(username, score);

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
    const apiCategory = this.selectedCategory.replace(/_/g, '-');

    this.http.get<ScoreResponse[]>(
      `http://localhost:8080/user/leaderboard?category=${apiCategory}`
    ).subscribe({
      next: (data) => {

        // Convert backend DTO → LeaderboardEntry
        let leaderboard: LeaderboardEntry[] = data.map(e => ({
          name: e.username,
          attempts: e.guesses,
          timeTaken: e.score,
          category: e.category,
          word: this.word
        }));

        // Add current player if they won
        if (this.stats.won) {
          const entry: LeaderboardEntry = {
            name: 'You',
            attempts: this.stats.attempts,
            timeTaken: this.stats.timeTaken ?? 0,
            category: this.selectedCategory,
            word: this.word
          };

          const exists = leaderboard.some(l => l.name === entry.name);
          if (!exists) leaderboard.push(entry);
        }

        // Sort by attempts first, then time
        leaderboard.sort((a, b) => {
          if (a.attempts !== b.attempts) return a.attempts - b.attempts;
          return a.timeTaken - b.timeTaken;
        });

        this.leaderboardEnt = leaderboard;
      },
      error: (err) => {
        console.error('Failed to load leaderboard', err);
      }
    });
  }



  closeResults() {
    this.resultsPopup = false;
    this.tab = 'me';
  }

  saveScore(username: string, score: number): void {
    const body = {
      username: username,
      score: score,
      category: this.selectedCategory,
      guesses: this.stats.attempts,
      word: this.word
    };

    this.http.post('http://localhost:8080/user/save-score', body, { responseType: 'text' })
      .subscribe({
        next: () => console.log('Score saved successfully'),
        error: (err) => console.error('Failed to save score', err)
      });
  }

}
