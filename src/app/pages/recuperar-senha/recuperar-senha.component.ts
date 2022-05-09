import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.css']
})
export class RecuperarSenhaComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  loading = false;
  submitted = false;
  timeoutEmail = false;
  tempo = 60;

  private timeout: any;

  // get form fields
  get formulario() { return this.form.controls; }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) { }

  ngOnDestroy(): void {
    clearInterval(this.timeout);
  }

  ngOnInit() {
    // direciona pra home se ja tiver um usuario logado
    if (this.accountService.token) {
      this.router.navigate(['/']);
    }

    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  recuperarSenha() {
    if (this.timeoutEmail)
      return;

    this.submitted = true;

    this.alertService.clear();

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.accountService.RecuperarSenha(this.formulario['email'].value)
      .pipe(first())
      .subscribe(
        () => {
          this.loading = false;

          this.alertService.success('Email enviado com sucesso', { keepAfterRouteChange: true });

          this.timeoutEmail = true;
          
          this.timeout = setInterval(() => {
            this.tempo--;

            if (this.tempo === 0) {
              this.tempo = 60;
              this.timeoutEmail = false;
            }
          }, 1000);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
}