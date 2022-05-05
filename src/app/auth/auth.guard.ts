import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private accountService: AccountService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = this.accountService.tokenValue;

    if (token) {
      // check a permissao do usuario
      if (route.data['permissao'] && route.data['permissao'].indexOf(token.tipoUsuario) === -1) {
        // direciona para home caso nao esteja autorizado
        this.router.navigate(['/']);
        return false;
      }
      // authorised so return true
      return true;
    }

    if (history.state?.rota) {
      this.router.navigate([`/${history.state.rota}`]);
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login']);
    return false;
  }
}