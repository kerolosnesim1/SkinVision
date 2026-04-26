import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private readonly storageKey = 'sv_sidebar_collapsed';

  private _isCollapsed$ = new BehaviorSubject<boolean>(
    localStorage.getItem(this.storageKey) === 'true'
  );
  private _isMobileOpen$ = new BehaviorSubject<boolean>(false);

  isCollapsed$ = this._isCollapsed$.asObservable();
  isMobileOpen$ = this._isMobileOpen$.asObservable();

  get isCollapsed(): boolean {
    return this._isCollapsed$.value;
  }

  toggle(): void {
    const next = !this._isCollapsed$.value;
    this._isCollapsed$.next(next);
    localStorage.setItem(this.storageKey, String(next));
  }

  openMobile(): void {
    this._isMobileOpen$.next(true);
  }

  closeMobile(): void {
    this._isMobileOpen$.next(false);
  }

  toggleMobile(): void {
    this._isMobileOpen$.next(!this._isMobileOpen$.value);
  }
}
