import { Component } from '@angular/core';
import {NgClass} from '@angular/common';

interface Box {
  letter: string;//which letter it is
  color: string;//what color it is
}

const GUESS_LIMIT = 6;

@Component({
  selector: 'app-game',
  imports: [
    NgClass
  ],
  templateUrl: './game.html',
  styleUrl: './game.css',
})

export class Game {
  word = 'VERSTAPPEN'; //Check if word is correctly formatted else lowercase makes issues
  word_length = this.word.length;
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
      for(let i = 0; i < this.word_length; i++){
        attempt.push({color: 'bg-slate-200', letter: ''});
      }
      this.guesses.push(attempt);
    }
  }
  //Logic for when letters are clicked on the website to make guesses
  letterClicked(letter: string) {
    if (this.currLetter >= this.word_length) {
      return; //Out of bounds, End of word reached
    }
    this.guesses[this.currGuess][this.currLetter].letter = letter;
    this.currLetter++;
  }

  // When deleting letters
  deleteClicked() {
    this.currLetter = Math.max(0, this.currLetter - 1);
    this.guesses[this.currGuess][this.currLetter].letter = ''
  }

  // Entering a guess
  message = '';

  enterClicked() {
    if(this.currLetter < this.word_length){
      this.message = 'Too short';
      return;
    }
    this.message = '';

    const answer = this.guesses[this.currGuess]; //Current answer to be checked
    //Make sure it is a real word
    this.isValidWord(answer.map(c => c.letter).join(''));
    //Color in the letters correctly
    for (let i = 0; i < this.word_length; i++){
      if (answer[i].letter === this.word[i]){
        answer[i].color = 'bg-green-500';
      }
      else if(this.word.includes(answer[i].letter)){
        answer[i].color = 'bg-yellow-400';
      }
      else{
        answer[i].color = 'bg-slate-400'
      }
    }

    //Move onto next guess
    this.currGuess++;
  }

  private isValidWord(s: string) {
    //Checks if a word is real/exists
    return true;
  }
}
