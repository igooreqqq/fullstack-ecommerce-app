import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/common/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-display',
  templateUrl: './user-display.component.html',
  styleUrls: ['./user-display.component.css']
})
export class UserDisplayComponent implements OnInit {

  loggedInUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const storedUser = this.authService.getLoggedInUserFromLocalStorage();
    if (storedUser) {
      this.loggedInUser = storedUser;
    } else {
      this.authService.loggedInUser$.subscribe((user) => {
        this.loggedInUser = user;
      });
    }
  }

  logout(): void {
    console.log('UserDisplayComponent logout called');
    this.authService.logout();
    location.reload();
  }

}