import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'SkinVision';
  isScrolled = false;
  isMobileMenuOpen = false;
  currentUser: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkUser();
    this.router.events.subscribe(() => {
      this.checkUser();
    });
  }

  checkUser() {
    const userStr = localStorage.getItem('currentUser');
    this.currentUser = userStr ? JSON.parse(userStr) : null;
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

  getDashboardLink(): string {
    if (!this.currentUser) return '/';
    const routes: { [key: string]: string } = {
      patient: '/patient',
      doctor: '/doctor',
      admin: '/admin'
    };
    return routes[this.currentUser.role] || '/';
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.router.navigate(['/']);
  }
}
