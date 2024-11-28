import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public _auth: AuthService, private router: Router) { }

  currentUser:any = {}
  imageUrl = "http://localhost:3000/getImage/"

  ngOnInit(): void {
    this._auth.userData$.subscribe(userData => {
      if (userData) {
        this.currentUser = userData;
      } else {
        // If no data is available, fall back to getting data from token
        this.currentUser = this._auth.getAuthorDataFromToken();
      }
    });
  }

  logout() {
    this.currentUser={}
    localStorage.removeItem("token")
    this.router.navigate(['/login'])
  }
}
