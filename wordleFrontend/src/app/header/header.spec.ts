import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Header } from './header';

describe('Header', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Header);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render logo and link', () => {
    const fixture = TestBed.createComponent(Header);
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a')!;
    expect(link.getAttribute('routerLink')).toBe('/');
    expect(link.textContent).toContain('DHBW');
    expect(link.textContent).toContain('WORDLE');
  });

});
