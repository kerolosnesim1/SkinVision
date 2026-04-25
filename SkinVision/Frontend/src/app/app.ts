import { Component, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'SkinVision';
  isScrolled = false;
  isMobileMenuOpen = false;

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  /** Exposes auth state to the template; same stream as AuthService.currentUser$. */
  get currentUser$() {
    return this.auth.currentUser$;
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
