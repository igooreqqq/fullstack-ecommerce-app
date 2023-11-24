import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { User } from './common/user';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-ecommerce';
  loggedInUser: User | null = null;
  isLoginPage: boolean = false;
  isRegisterPage: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.loggedInUser$.subscribe(
      user => {
        this.loggedInUser = user;
      }
    );

    
    this.authService.isLoginPage$.subscribe(
      isLoginPage => {
        this.isLoginPage = isLoginPage;
      }
    );

    this.authService.isRegisterPage$.subscribe(
      isRegisterPage => {
        this.isRegisterPage = isRegisterPage;
      }
    );

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // sprawdzanie, czy aktualna trasa to strona logowania
      this.isLoginPage = event.url.includes('/login');
      this.isRegisterPage = event.url.includes('/register');
    });
  }
}