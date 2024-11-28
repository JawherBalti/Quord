import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root"
})

export class AuthGuard implements CanActivate {
  constructor(private _auth: AuthService, private router: Router) { }

  canActivate() {
    if (this._auth.isLoggedIn()) return true
    else {
      this.router.navigate(['/login'])
      return false
    }
  }
};
