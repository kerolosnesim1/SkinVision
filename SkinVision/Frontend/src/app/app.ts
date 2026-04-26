import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { User } from './models/models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  title = 'SkinVision';
  isScrolled = false;
  isMobileMenuOpen = false;
  isProfileMenuOpen = false;
  isDashboardRoute = false;
  isMinimalRoute = false;

  private routerSub?: Subscription;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.updateRouteFlags(this.router.url);

    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.updateRouteFlags(e.urlAfterRedirects);
        this.isProfileMenuOpen = false;
        this.isMobileMenuOpen = false;
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private updateRouteFlags(url: string): void {
    this.isDashboardRoute = url.startsWith('/dashboard');
    this.isMinimalRoute = ['/login', '/register', '/reset-password'].some(p =>
      url.startsWith(p)
    );
  }

  get currentUser$() {
    return this.auth.currentUser$;
  }

  getProfileInitial(user: User): string {
    return (user.doctorProfile?.fullName || user.username || user.email || 'D')
      .trim().charAt(0).toUpperCase();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  toggleProfileMenu(event: Event): void {
    event.stopPropagation();
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.isProfileMenuOpen = false;
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
