import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PageNotFound } from './page-not-found';

describe('PageNotFound', () => {
  let component: PageNotFound;
  let fixture: ComponentFixture<PageNotFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNotFound, RouterTestingModule] // import RouterTestingModule for routerLink
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotFound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display "404" text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('404');
  });

  it('should display "Page not found" message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Page not found');
  });

  it('should contain a router link back to home', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('routerLink')).toBe('/');
  });
});
