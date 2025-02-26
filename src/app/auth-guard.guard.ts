import { UsuarioService } from 'app/services/usuarios/usuario-service.service';
// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { LoginService } from './services/usuario/login.service'; 

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor(private loginService: LoginService, private router: Router) {}

//   canActivate(): boolean {
//     if (this.loginService.isLoggedIn()) {
//       return true;
//     } else {
//       this.router.navigate(['/sesionCaducada']);
//       return false;
//     }
//   }
// }
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './services/usuarios/login-service.service'; 

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const isLoggedIn = this.loginService.isLoggedIn();

    if (!isLoggedIn) {
      this.router.navigate(['/sesionCaducada'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    return true; 
  }
}
