import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
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

    //get form fields
    get formulario() { return this.form.controls; }

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        // direciona pra home se ja tiver um usuario logado
        if (this.accountService.userValue) {
            this.router.navigate(['/']);
        }

        this.form = this.formBuilder.group({
            nome: ['', [Validators.required]],
            sobrenome: ['', [Validators.required]],
            rgm: ['', [Validators.required, Validators.minLength(8)]],
            cpf: ['', [Validators.required, Validators.minLength(11)]],
            email: ['', [Validators.required, Validators.email]],
            senha: ['', [Validators.required, Validators.minLength(6)]],
            tipoUsuario: [TipoUser.aluno, Validators.required],
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
                data => {
                    this.alertService.success('Cadastrado com sucesso', { keepAfterRouteChange: true });
                    this.router.navigate(['/login'], { relativeTo: this.route });
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}