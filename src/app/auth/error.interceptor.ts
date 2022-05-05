import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountService } from '../services/account.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError((erro: HttpErrorResponse) => {
            if (erro.status === 401) {
                // auto logout if 401 response returned from api
                this.accountService.logout();
            }

            if (erro.error.mensagem) {
                return throwError(() => new Error(erro.error.mensagem));
            }

            if (erro.error.errors) {
                return throwError(() => erro.error.errors);
            }

            return throwError(() => erro);
            // return throwError(erro);
        }))
    }
}