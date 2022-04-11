import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AulaService } from '../../services/aula.service';
import { TipoUser, User } from '../../models/user';
import { AccountService } from '../../services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Materia } from '../../models/materia';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Aula } from 'src/app/models/aula';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private aulas!: Aula[];

  materias: Materia[] = [];
  user!: User;
  form!: FormGroup;
  loading = false;
  submitted = false;
  aulaAtual = false;
  exibirQRCode = false;
  scannerAtivo = false;
  qrCodeLido = false;
  presencaValidada = false;

  @ViewChild('scanner')
  scanner!: ZXingScannerComponent;
  hasCameras = false;
  hasPermission!: boolean;
  qrResultString!: string;
  formatoQRCode = [BarcodeFormat.QR_CODE];
  valueQRCode = '';

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

      this.aulasService.getAllByProfessor(this.user.id).subscribe({
        next: aulas => {
          this.aulas = aulas;
          this.ValidarAula();
        },
        error: e => {
          this.alertService.error(e);
        }
      });

      this.form = this.formBuilder.group({
        dateFim: ['', [Validators.required]],
        curso: ['', [Validators.required]],
        materia: ['', [Validators.required]]
      });
    }

    if (this.isAluno) {
      this.aulasService.getAllByAluno(this.user.id).subscribe({
        next: aulas => {
          this.aulas = aulas;

          let dateAgora = new Date(Date.now()).toLocaleString();

          this.aulas.map(a => {
            if (dateAgora >= new Date(a.inicio).toLocaleString() && dateAgora <= new Date(a.fim).toLocaleString()) {
              this.presencaValidada = true;
              return;
            }
          })

        },
        error: e => {
          this.alertService.error(e);
        }
      });
    }
  }

  private ValidarAula() {
    let horaAtual = new Date(Date.now()).toLocaleString();

    const aulaAtual = this.aulas.find(a => horaAtual >= new Date(a.inicio).toLocaleString() && horaAtual <= new Date(a.fim).toLocaleString())

    if (aulaAtual) {
      this.exibirQRCode = true;
      this.aulaAtual = false;
    }
    else {
      this.exibirQRCode = false;
      this.aulaAtual = true;
    }
  }

  criarAula(): void {
    if (this.isProfessor) {
      this.submitted = true;

      this.alertService.clear();

      if (this.form.invalid) {
        return;
      }

      let horaInicio = new Date(Date.now());

      let horasMinutos = <string>this.formulario['dateFim'].value;

      let horaFim = new Date(Date.now());
      horaFim.setHours(parseInt(horasMinutos.split(':')[0]));
      horaFim.setMinutes(parseInt(horasMinutos.split(':')[1]));

      if (horaFim <= horaInicio) {
        this.alertService.error('Digite uma hora maior que a hora atual');
        return;
      }

      this.loading = true;

      let aula = new Aula(0, this.user, this.formulario['curso'].value, this.formulario['materia'].value, horaInicio, horaFim, [])

      this.aulasService.register(aula).subscribe({
        next: idAula => {
          this.valueQRCode = `${idAula}`;

          this.exibirQRCode = true;
          this.aulaAtual = false;
        },
        error: e => {
          this.alertService.error(e);
          this.loading = false;
        }
      });
    }
  }

  PreencherMaterias(event: any) {
    this.materias = this.user.curso.find(c => c.id === parseInt(event.target.value))!.materias;
  }

  lerQRCode(resultString: string) {
    this.qrCodeLido = true;
    this.qrResultString = resultString;


    this.aulasService.update(resultString, this.user.id).subscribe({
      next: () => {
        this.alertService.success('presença validada');
        this.presencaValidada = true;
      },
      error: e => {
        this.alertService.error(e);
      }
    });

  }

  HabilitarScanner() {
    this.scannerAtivo = true;
  }

  onHasPermission(resposta:any) {
    this.hasPermission = resposta;
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.hasCameras = Boolean(devices && devices.length);
  }  
}



