import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { TipoUser, User } from '../models/user';

// array in local storage for registered users
let users = <User[]>JSON.parse(localStorage.getItem('usuarios')) || [];

let prof: User = new User();
prof.id = 0,
    prof.email = 'prof@email.com',
    prof.senha = 'prof123',
    prof.rgm = '12345678',
    prof.cpf = '11111111111',
    prof.nome = 'Andrea',
    prof.sobrenome = 'Martins',
    prof.tipoUsuario = TipoUser.professor

let adm: User = new User();
adm.id = 0,
    adm.email = 'adm@email.com',
    adm.senha = 'adm123',
    adm.rgm = '87654321',
    adm.cpf = '11111111100',
    adm.nome = 'Adailton',
    adm.sobrenome = 'Pereira',
    adm.tipoUsuario = TipoUser.adm

let ok = true;

if (users.find(x => x.cpf === prof.cpf)) {
    ok = false;
}

if (ok) {
    prof.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
    users.push(prof);
    localStorage.setItem('usuarios', JSON.stringify(users));
}

if (users.find(x => x.cpf === adm.cpf)) {
    ok = false;
}

if (ok) {
    adm.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
    users.push(adm);
    localStorage.setItem('usuarios', JSON.stringify(users));
}

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/login') && method === 'POST':
                    return autenticar();
                case url.endsWith('/cadastro') && method === 'POST':
                    return cadastro();
                // case url.endsWith('/users') && method === 'GET':
                //     return getUsers();
                case url.match(/\/role\/\d+$/) && method === 'GET':
                    return getUsersByRole();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.match(/\/users\/\d+$/) && method === 'PUT':
                    return updateUser();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        // mock rotas
        function autenticar() {
            const { acesso, senha } = body;

            let user: User;

            if (acesso.includes('@')) {
                //email
                user = users.find(x => x.email === acesso && x.senha === senha);
            }
            else if (acesso.lenght === 8) {
                //rgm
                user = users.find(x => x.rgm === acesso && x.senha === senha);
            }
            else if (acesso.lenght == 11) {
                //cpf
                user = users.find(x => x.cpf === acesso && x.senha === senha);
            }

            if (!user) return error('Acesso ou Senha incorreto');
            return ok({
                id: user.id,
                email: user.email,
                senha: user.senha,
                rgm: user.rgm,
                cpf: user.cpf,
                nome: user.nome,
                sobrenome: user.sobrenome,
                tipoUsuario: user.tipoUsuario,
                token: 'fake-jwt-token'
            })
        }

        function cadastro() {
            const user = body

            if (users.find(x => x.cpf === user.cpf)) {
                return error('Já existe um CPF cadastrado')
            }

            if (users.find(x => x.rgm === user.rgm)) {
                return error('Já existe um RGM cadastrado')
            }

            if (users.find(x => x.email === user.email)) {
                return error('Já existe um email cadastrado')
            }

            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem('usuarios', JSON.stringify(users));
            return ok();
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            const user = users.find(x => x.id === idFromUrl());
            return ok(user);
        }

        function getUsersByRole() {
            if (!isLoggedIn()) return unauthorized();

            const user = users.filter(x => x.tipoUsuario === idFromUrl());
            return ok(user);
        }

        function updateUser() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let user = users.find(x => x.id === idFromUrl());

            // only update password if entered
            if (!params.password) {
                delete params.password;
            }

            // update and save user
            Object.assign(user, params);
            localStorage.setItem('usuarios', JSON.stringify(users));

            return ok();
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter(x => x.id !== idFromUrl());
            localStorage.setItem('usuarios', JSON.stringify(users));
            return ok();
        }

        // status code

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}