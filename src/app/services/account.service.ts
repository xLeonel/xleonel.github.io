import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TipoUser, User } from '../models/user';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Token, TokenResponse } from '../models/token';
import jwt_decode from "jwt-decode";
import { Periodo } from '../models/periodo';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private tokenSubject!: BehaviorSubject<Token>;
    public token!: Observable<Token>;

    public get tokenValue(): Token {
        return this.tokenSubject.value;
    }

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.tokenSubject = new BehaviorSubject<Token>(null!);
        this.token = this.tokenSubject.asObservable();
    }

    login(emailCpfRgm: string, senha: string) {
        return this.http.post<TokenResponse>(`${environment.apiUrl}/login`, { emailCpfRgm, senha })
            .pipe(map(response => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                let tokenDecode: any = jwt_decode(response.token);

                let idUser = parseInt(tokenDecode['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
                let nomeCompleto = tokenDecode['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
                let email = tokenDecode['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
                let tipoUser = parseInt(tokenDecode['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) === TipoUser.aluno ?
                    TipoUser.aluno : parseInt(tokenDecode['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) === TipoUser.professor ?
                        TipoUser.professor : TipoUser.adm;


                this.tokenSubject.next(new Token(idUser, nomeCompleto, email, tipoUser, response.token));

                return response;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        this.tokenSubject.next(null!);

        this.router.navigate(['/login']);
    }

    register(user: any) {
        let userModel = {
            email: user.email,
            senha: user.senha,
            nome: user.nome,
            sobrenome: user.sobrenome,
            cpf: user.cpf,
            rgm: user.rgm,
            idperiodo: Periodo[user.periodo],
            idcurso: user.curso.id,
            idsemestre: user.semestre
        }

        return this.http.post(`${environment.apiUrl}/alunos`, userModel);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getAllByRole(tipoUser: TipoUser) {
        return this.http.get<User[]>(`${environment.apiUrl}/usuarios/role/${tipoUser}`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    update(id: any, params: any) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.tokenValue.idUser) {
                    //todo: atualizar o token caso o email, senha seja atualizado
                }
                return x;
            }));
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.tokenValue.idUser) {
                    this.logout();
                }
                return x;
            }));
    }
}
