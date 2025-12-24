import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('Home Component', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, Home]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
  });

  it('should open and close login modal', () => {
    component.openLogin();
    expect(component.showLoginModal).toBeTrue();
    component.closeLogin();
    expect(component.showLoginModal).toBeFalse();
  });

  it('should login admin correctly', () => {
    component.username = 'admin';
    component.password = 'secret';
    component.login();
    expect(component.isLoggedIn).toBeTrue();
    expect(component.isAdmin).toBeTrue();
    expect(component.showLoginModal).toBeFalse();
  });

  it('should show error on wrong credentials', () => {
    component.username = 'wrong';
    component.password = 'wrong';
    component.login();
    expect(component.errorMessage).toBe('Invalid username or password');
    expect(component.isLoggedIn).toBeFalse();
  });

  it('should login guest correctly', () => {
    component.loginGuest();
    expect(component.isLoggedIn).toBeTrue();
    expect(component.isAdmin).toBeFalse();
    expect(component.showLoginModal).toBeFalse();
  });

  it('should logout correctly', () => {
    localStorage.setItem('user', 'admin');
    localStorage.setItem('isAdmin', 'true');
    component.logout();
    expect(component.isLoggedIn).toBeFalse();
    expect(component.isAdmin).toBeFalse();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
