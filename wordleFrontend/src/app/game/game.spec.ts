import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Game } from './game';

describe('Game', () => {
  let component: Game;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Game]
    });

    component = TestBed.inject(Game);
  });

  // --- Helper functions ---
  function startGame(word: string) {
    component.selectedCategory = 'test';
    component.word = word.toUpperCase();
    component.wordLength = word.length;
    component.initGuesses();
    component.showCategoryModal = false;
    component.startTime = Date.now();
  }

  function enterGuess(guess: string) {
    guess.split('').forEach(letter => component.letterClicked(letter));
    component.enterClicked();
  }

  // --- Tests ---

  it('should create the game component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize guesses correctly', () => {
    component.word = 'TEST';
    component.wordLength = component.word.length;
    component.initGuesses();
    expect(component.guesses.length).toBe(6); // GUESS_LIMIT
    expect(component.guesses[0].length).toBe(4); // wordLength
  });

  it('should mark game as won when guess is correct', fakeAsync(() => {
    startGame('MESSI');

    enterGuess('MESSI');

    // wait for flip + results popup timeout
    tick(200 * component.wordLength + 600);

    expect(component.stats.won).toBeTrue();
    expect(component.stats.attempts).toBe(1);
    expect(component.resultsPopup).toBeTrue();
  }));

  it('should reject guess that is too short', () => {
    startGame('TESLA');

    component.letterClicked('T');
    component.enterClicked();

    expect(component.message).toBe('Your answer is too short');
    expect(component.currGuess).toBe(0);
  });

  it('should mark game as lost after 6 incorrect guesses', fakeAsync(() => {
    startGame('TESLA');

    for (let i = 0; i < 6; i++) {
      enterGuess('AAAAA'); // wrong guess
      tick(200 * component.wordLength + 600);
    }

    expect(component.stats.won).toBeFalse();
    expect(component.stats.attempts).toBe(6);
    expect(component.resultsPopup).toBeTrue();
  }));

  it('should color letters correctly for a mix of correct, misplaced, and wrong letters', fakeAsync(() => {
    startGame('LEBRON');

    enterGuess('LEMONS'); // L, E correct; O,N misplaced; M, S wrong
    tick(200 * component.wordLength + 600);

    const colors = component.guesses[0].map(box => box.color);
    expect(colors[0]).toBe('green'); // L
    expect(colors[1]).toBe('green'); // E
    expect(colors[2]).toBe('gray');  // M
    expect(colors[3]).toBe('yellow'); // O
    expect(colors[4]).toBe('yellow');  // N
    expect(colors[5]).toBe('gray');  // S
  }));

  it('should delete letter correctly', () => {
    component.word = 'ABCD';
    component.wordLength = 4;
    component.initGuesses();
    component.letterClicked('A');
    component.letterClicked('B');
    expect(component.currLetter).toBe(2);
    component.deleteClicked();
    expect(component.currLetter).toBe(1);
    expect(component.guesses[0][1].letter).toBe('');
  });

  // --- Leaderboard and word info tests ---

  it('should populate leaderboard correctly when won', fakeAsync(() => {
    component.word = 'ABCD';
    component.wordLength = 4;
    component.initGuesses();
    component.guesses[0] = component.word.split('').map(l => ({ letter: l, color: '', flip: false, pop: false, revealed: false }));
    component.currLetter = 4;
    component.enterClicked();
    tick(2000);
    expect(component.leaderboardEnt.some(e => e.name === 'You')).toBeTrue();
  }));

  it('should update leaderboard after winning', fakeAsync(() => {
    startGame('MESSI');

    enterGuess('MESSI');
    tick(200 * component.wordLength + 600);

    component.loadLeaderboard(); // normally async
    tick(); // allow observable to emit

    expect(component.leaderboardEnt.length).toBeGreaterThan(0);
    const myEntry = component.leaderboardEnt.find(e => e.name === 'You');
    expect(myEntry).toBeDefined();
    expect(myEntry?.attempts).toBe(component.stats.attempts);
    expect(myEntry?.word).toBe('MESSI');
    expect(myEntry?.category).toBe('test');
  }));

  it('should set word info correctly', () => {
    startGame('TESLA');

    component.loadWordInfo();

    expect(component.wordInfo?.word).toBe('TESLA');
    expect(component.wordInfo?.definition).toContain('electric vehicle');
    expect(component.wordInfo?.category).toBe('test');
  });

  it('should reset results popup and tab when closing results', () => {
    component.resultsPopup = true;
    component.tab = 'board';

    component.closeResults();

    expect(component.resultsPopup).toBeFalse();
    expect(component.tab).toBe('me');
  });


});
