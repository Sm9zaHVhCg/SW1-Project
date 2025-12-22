import { Component } from '@angular/core';
import {NgClass} from '@angular/common';

interface Box {
  letter: string;//which letter it is
  color: string;//what color it is
  flip: boolean;
  pop: boolean;
  revealed: boolean;
}

const GUESS_LIMIT = 6;

@Component({
  selector: 'app-game',
  imports: [
    NgClass
  ],
  templateUrl: './game.html',
  styleUrls: ['./game.css'],
})

export class Game {
  word = 'VERSTAPPEN'; //Check if word is correctly formatted else lowercase makes issues
  wordLength = this.word.length;
  guesses: Box[][] = [];//Guesses are made up of an 2D array of boxes
  currGuess = 0; //Current guess of GUESS_LIMIT
  currLetter = 0; //Current letter of guess

  // Keyboard render
  top = 'QWERTZUIOPÜ'.split('');
  middle = 'ASDFGHJKLÖÄ'.split('');
  bottom = 'YXCVBNM'.split('');

  constructor(){
    // For the game itself (attempts made up of boxes)
    for(let j = 0; j < GUESS_LIMIT; j++){
      const attempt: Box[] = [];
      for(let i = 0; i < this.wordLength; i++){
        attempt.push({
          letter: '',
          color: '',
          flip: false,
          pop: false,
          revealed: false,});
      }
      this.guesses.push(attempt);
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
  message = '';

  enterClicked() {
    let greenCount = 0;

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

    // Won
    if (greenCount === this.wordLength) {
      this.message = "You won!";
      return;
    }

    // Loss (last guess used)
    if (this.currGuess === GUESS_LIMIT - 1) {
      this.message = "You lost!";
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
}
