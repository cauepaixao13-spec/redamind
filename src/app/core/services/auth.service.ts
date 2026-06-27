import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'redamind_auth';

  isAuthenticated = signal<boolean>(this.checkAuth());

  constructor(private router: Router) {}

  private checkAuth(): boolean {
    try {
      return localStorage.getItem(this.STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  }

  login(username: string, password: string): boolean {
    if (username.trim() === 'Caue' && password === 'Admin') {
      localStorage.setItem(this.STORAGE_KEY, 'true');
      this.isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }
}
