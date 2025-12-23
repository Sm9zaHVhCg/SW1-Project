import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Game } from '../game/game';
import { Home } from '../home/home';
import { FormsModule } from '@angular/forms';

describe('Game + Home Integration', () => {
  let fixture: ComponentFixture<Game>;
  let game: Game;
  let homeFixture: ComponentFixture<Home>;
  let home: Home;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Game, Home, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Game);
    game = fixture.componentInstance;
    homeFixture = TestBed.createComponent(Home);
    home = homeFixture.componentInstance;
  });

  it('should start a game after selecting a category', () => {
    game.categorySelected('sports');
    expect(game.word).toBeTruthy();
    expect(game.guesses.length).toBe(6);
    expect(game.currGuess).toBe(0);
    expect(game.currLetter).toBe(0);
  });

  it('should login as guest and start a game', fakeAsync(() => {
    home.loginGuest();
    expect(home.isLoggedIn).toBeTrue();
    expect(home.isAdmin).toBeFalse();

    game.categorySelected('cars');
    tick(500);
    expect(game.word).toBeTruthy();
  }));
});
