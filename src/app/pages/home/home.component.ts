import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AulaService } from '../../services/aula.service';
import { TipoUser, User } from '../../models/user';
import { AccountService } from '../../services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Materia } from '../../models/materia';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  materias: Materia[] = [];
  user!: User;
  form!: FormGroup;
  loading = false;
  submitted = false;

  allowedFormats = [BarcodeFormat.QR_CODE];
  scannerEnabled = false;

  @ViewChild('scanner', { static: false })
  scanner!: ZXingScannerComponent;

  get isAluno() {
    return this.user.tipoUsuario === TipoUser.aluno;
  }

  get isProfessor() {
    return this.user.tipoUsuario === TipoUser.professor;
  }

  //get form fields
  get formulario() { return this.form.controls; }


  constructor(private accountService: AccountService,
    private aulasService: AulaService,
    private alertService: AlertService,
    private formBuilder: FormBuilder) {
    this.accountService.user.subscribe(x => this.user = x);
  }

  ngOnInit(): void {
    if (this.isProfessor) {
      this.form = this.formBuilder.group({
        dateFim: ['', [Validators.required]],
        curso: ['', [Validators.required]],
        materia: ['', [Validators.required]]
      });
    }
  }

  criarAula(): void {
    console.log(this.form.value)
  }

  PreencherMaterias(event: any) {
    this.materias = this.user.curso.find(c => c.id === parseInt(event.target.value))!.materias;
  }

  camerasNotFound(e: any) {
    // Display an alert modal here
    this.alertService.info('camera not found');

    console.log(e);
  }

  cameraFound(e: any) {
    // Log to see if the camera was found
    this.alertService.info('camera found');
    console.log(e);
  }

  onScanSuccess(result: string) {
    this.alertService.info('QR CODE LIDo');

    console.log(result);
  }
}



