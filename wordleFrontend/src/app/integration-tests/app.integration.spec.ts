import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { App } from '../app';
import { Header } from '../header/header';
import { PageNotFound } from '../page-not-found/page-not-found';
import { Home } from '../home/home';

describe('App Integration', () => {
  let fixture: ComponentFixture<App>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        Header,
        Home,
        PageNotFound,
        RouterTestingModule.withRoutes([
          { path: '', component: Home },
          { path: '**', component: PageNotFound }
        ])
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await router.navigate(['']);
  });

  it('should navigate to Home by default', async () => {
    expect(location.path()).toBe('/');
    expect(fixture.nativeElement.querySelector('app-header')).toBeTruthy();
  });

  it('should show PageNotFound on invalid route', async () => {
    await router.navigate(['/invalid-route']);
    fixture.detectChanges();
    expect(location.path()).toBe('/invalid-route');
    expect(fixture.nativeElement.textContent).toContain('Page not found');
  });
});
