import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router
  ) {}

canActivate(): boolean {

  const tenantId = localStorage.getItem('tenantId');

  console.log('Guard Running');
  console.log('TenantId =', tenantId);

  if (tenantId) {
    return true;
  }

  this.router.navigate(['/login']);
  return false;
}

}
