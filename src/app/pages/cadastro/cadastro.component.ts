import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Curso } from 'src/app/models/curso';
import { CursoService } from 'src/app/services/curso.service';
import { Periodo } from '../../models/periodo';
import { Semestre } from '../../models/semestre';
import { TipoUser } from '../../models/user';
import { AccountService } from '../../services/account.service';
import { AlertService } from '../../services/alert.service';

@Component({
    selector: 'app-cadastro',
    templateUrl: './cadastro.component.html',
    styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;

    cursos: Curso[] = [];

    semestres = Semestre;
    periodos = Periodo;

    get valuesSemestres() {
        var values = Object.values(this.semestres);
        return values.slice(values.length / 2);
    }

    get valuesPeriodos() {
        var keys = Object.keys(this.periodos);

        keys.keys
        return keys.slice(keys.length / 2);
    }

    //get form fields
    get formulario() { return this.form.controls; }

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private cursosService: CursoService
    ) { }

    ngOnInit() {
        // direciona pra home se ja tiver um usuario logado
        if (this.accountService.userValue) {
            this.router.navigate(['/']);
        }

        this.getCursos();

        this.form = this.formBuilder.group({
            nome: ['', [Validators.required]],
            sobrenome: ['', [Validators.required]],
            rgm: ['', [Validators.required, Validators.minLength(8)]],
            cpf: ['', [Validators.required, Validators.minLength(11)]],
            email: ['', [Validators.required, Validators.email]],
            senha: ['', [Validators.required, Validators.minLength(6)]],
            tipoUsuario: [TipoUser.aluno, Validators.required],
            curso: ['', [Validators.required]],
            semestre: ['', [Validators.required]],
            periodo: ['', [Validators.required]],
        });

    }

    registrar() {
        this.submitted = true;

        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }

        this.loading = true;

        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe(
                () => {
                    // this.alertService.success('Cadastrado com sucesso', { keepAfterRouteChange: true });
                    this.router.navigate(['/login'], { relativeTo: this.route });
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    KeyFromPeriodo(key: string) {
        return this.periodos[key]
    }

    private async getCursos() {
        this.cursosService.getAll()
            .pipe(first())
            .subscribe(
                data => {
                    this.cursos = data;
                },
                error => {
                    this.alertService.error(error);
                });
    }
}