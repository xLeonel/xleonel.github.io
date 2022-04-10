import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { TipoUser, User } from '../models/user';
import { Curso } from '../models/curso';
import { Materia } from '../models/materia';
import { Semestre } from '../models/semestre';
import { Aula } from '../models/aula';
import { Periodo } from '../models/periodo';

// array in local storage for registered users
let users = <User[]>JSON.parse(localStorage.getItem('usuarios')!) || [];
let materias = <Materia[]>JSON.parse(localStorage.getItem('materias')!) || [];
let cursos = <Curso[]>JSON.parse(localStorage.getItem('cursos')!) || [];
let aulas = <Aula[]>JSON.parse(localStorage.getItem('aulas')!) || [];

// inicialize mock materias
// **ads**
let materia = new Materia(0, 'Técnicas de programação', Semestre.primeiro);
cadastroMateria(materia);
materia = new Materia(0, 'Banco de dados', Semestre.primeiro);
cadastroMateria(materia);
materia = new Materia(0, 'Técnicas de desenvolvimento de algoritmos', Semestre.segundo);
cadastroMateria(materia);
materia = new Materia(0, 'Programação orientada a objetos', Semestre.segundo);
cadastroMateria(materia);
materia = new Materia(0, 'Programação web', Semestre.segundo);
cadastroMateria(materia);
materia = new Materia(0, 'Engenharia de software', Semestre.terceiro);
cadastroMateria(materia);
materia = new Materia(0, 'Fundamentos de estruturas de dados', Semestre.terceiro);
cadastroMateria(materia);
// **psicologia**
materia = new Materia(0, 'História da Psicologia', Semestre.primeiro);
cadastroMateria(materia);
materia = new Materia(0, 'Psicologia social', Semestre.primeiro);
cadastroMateria(materia);
materia = new Materia(0, 'Filosofia e ética', Semestre.segundo);
cadastroMateria(materia);
materia = new Materia(0, 'práticas profissionais', Semestre.segundo);
cadastroMateria(materia);
materia = new Materia(0, 'Fundamentos metodológicos', Semestre.segundo);
cadastroMateria(materia);
materia = new Materia(0, 'Fenômenos e processos psicológicos básico', Semestre.terceiro);
cadastroMateria(materia);
materia = new Materia(0, 'Fundamentos epistemológicos e históricos', Semestre.terceiro);
cadastroMateria(materia);

// inicialize mock cursos
let curso = new Curso(0, 'Análise e Desenvolvimento de Sistemas', materias.slice(0, 6));
cadastroCurso(curso);
curso = new Curso(0, 'Psicologia', materias.slice(7, 13));
cadastroCurso(curso);

// inicialize mock users
let user: User = new User(0, 'prof@email.com', 'prof123', '12345678', '11111111111', 'Andrea', 'Martins', TipoUser.professor, Periodo.integral, [cursos[0]]);
cadastroUser(user);
user = new User(0, 'adm@email.com', 'adm123', '87654321', '11111111100', 'Adailton', 'Pereira', TipoUser.adm, Periodo.integral, []);
cadastroUser(user);


// inicialize mock aulas
// cadastroAula();

function cadastroUser(usuario: User) {
    let ok = true;

    if (users.find(x => x.cpf === usuario.cpf)) {
        ok = false;
    }

    if (ok) {
        usuario.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
        users.push(usuario);
        localStorage.setItem('usuarios', JSON.stringify(users));
    }
}

function cadastroCurso(curso: Curso) {
    let ok = true;

    if (cursos.find(x => x.nome === curso.nome)) {
        ok = false;
    }

    if (ok) {
        curso.id = cursos.length ? Math.max(...cursos.map(x => x.id)) + 1 : 1;
        cursos.push(curso);
        localStorage.setItem('cursos', JSON.stringify(cursos));
    }
}

function cadastroMateria(materia: Materia) {
    let ok = true;

    if (materias.find(x => x.nome === materia.nome)) {
        ok = false;
    }

    if (ok) {
        materia.id = materias.length ? Math.max(...materias.map(x => x.id)) + 1 : 1;
        materias.push(materia);
        localStorage.setItem('materias', JSON.stringify(materias));
    }
}

function cadastroAula() {
    let prof = users.filter(u => u.tipoUsuario == TipoUser.professor)[0];
    let materias = prof.curso[0].materias.map(m => { return m });
    let aula = new Aula(0, prof, prof.curso[0], materias[0], new Date('April 07, 2022 07:15:30'), new Date('April 07, 2022 07:20:00'), []);

    let ok = true;

    let dateInicio = new Date(aula.inicio).toLocaleString();

    if (aulas.find(x => x.professor.cpf === aula.professor.cpf && (new Date(x.inicio).toLocaleString() >= dateInicio && new Date(x.fim).toLocaleString() <= dateInicio))) {
        ok = false;
    }

    if (ok) {
        aula.id = aulas.length ? Math.max(...aulas.map(x => x.id)) + 1 : 1;
        aulas.push(aula);
        localStorage.setItem('aulas', JSON.stringify(aulas));
    }
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
                case url.endsWith('/aulas') && method === 'POST':
                    return cadastroAulas();
                case url.endsWith('/cursos') && method === 'GET':
                    return getCursos();
                case url.match(/\/aulas\/\d+$/) && method === 'GET':
                    return getAulaByProfessor();
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

            let user: any;

            if (acesso.includes('@')) {
                //email
                user = users.find(x => x.email === acesso && x.senha === senha)!;
            }
            else if (acesso.lenght === 8) {
                //rgm
                user = users.find(x => x.rgm === acesso && x.senha === senha)!;
            }
            else if (acesso.lenght == 11) {
                //cpf
                user = users.find(x => x.cpf === acesso && x.senha === senha)!;
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
                token: 'fake-jwt-token',
                curso: user.curso
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

        function cadastroAulas() {
            const aula = body

            const dateInicio = new Date(aula.inicio).toLocaleString();

            if (aulas.find(x => x.professor.cpf === aula.professor.cpf && (new Date(x.inicio).toLocaleString() >= dateInicio && new Date(x.fim).toLocaleString() <= dateInicio))) {
                return error('Você já tem uma aula nesse periodo')
            }

            aula.id = aulas.length ? Math.max(...aulas.map(x => x.id)) + 1 : 1;
            aulas.push(aula);
            localStorage.setItem('aulas', JSON.stringify(aulas));
            return ok();
        }

        function getAulaByProfessor() {
            if (!isLoggedIn()) return unauthorized();

            const aulasProfessor = aulas.filter(x => x.professor.id === idFromUrl());
            return ok(aulasProfessor);
        }

        // function getAulaByHora() {
        //     if (!isLoggedIn()) return unauthorized();

        //     const urlParts = url.split('/');
        //     const idProfessor = parseInt(urlParts[urlParts.length - 1]);
        //     const dateAgora = new Date(urlParts[urlParts.length - 2]).toLocaleString();

        //     console.log(dateAgora)
        //     console.log(aulas)

        //     const aulasProfessor = aulas.filter(x => x.professor.id === idProfessor && (new Date(x.inicio).toLocaleString() >= dateAgora && new Date(x.fim).toLocaleString() <= dateAgora));
        //     return ok(aulasProfessor);
        // }

        function getCursos() {
            return ok(cursos);
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

        function ok(body?: any) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message: any) {
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