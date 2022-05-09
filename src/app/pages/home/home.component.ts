import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AulaService } from '../../services/aula.service';
import { TipoUser } from '../../models/user';
import { AccountService } from '../../services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Materia } from '../../models/materia';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Token } from '../../models/token';
import { AulaModel } from '../../models/aula-model';
import { Aula } from '../../models/aula';
import { first } from 'rxjs';
import { PresencaService } from '../../services/presenca.service';
import { CursoService } from '../../services/curso.service';
import { Curso } from '../../models/curso';
import { LocalizacaoService } from '../../services/localizacao.service';
import { Localizacao } from '../../models/localizacao';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private aulas!: AulaModel[];
  private localizacao: Localizacao | undefined;
  private localizacaoUnicid = new Localizacao(-23.535990, -46.559890);

  cursosProfessor: Curso[] = []
  materias: Materia[] = [];
  token!: Token;
  form!: FormGroup;
  loading = false;
  submitted = false;
  aulaAtual = false;
  exibirQRCode = false;
  scannerAtivo = false;
  qrCodeLido = false;
  presencaValidada = false;
  habilitarLerQrCode = false;
  carregado = false;
  exibirMapa = false;

  @ViewChild('scanner')
  scanner!: ZXingScannerComponent;
  hasCameras = false;
  hasPermission!: boolean;
  formatoQRCode = [BarcodeFormat.QR_CODE];
  valueQRCode = '';

  mapOptions!: google.maps.MapOptions;

  markerUnicid = { position: { lat: this.localizacaoUnicid.latitude, lng: this.localizacaoUnicid.longitude } };

  markers = [this.markerUnicid];

  get isAluno() {
    return this.token.tipoUsuario === TipoUser.aluno;
  }

  get isProfessor() {
    return this.token.tipoUsuario === TipoUser.professor;
  }

  get isAdmin() {
    return this.token.tipoUsuario === TipoUser.adm;
  }

  //get form fields
  get formulario() { return this.form.controls; }

  constructor(private accountService: AccountService,
    private aulasService: AulaService,
    private presencaService: PresencaService,
    private alertService: AlertService,
    private cursoService: CursoService,
    private localizacaoService: LocalizacaoService,
    private formBuilder: FormBuilder) {
    this.accountService.token.subscribe(x => this.token = x);
  }

  async ngOnInit(): Promise<void> {
    this.localizacao = await this.localizacaoService.getLocation().then(localizacao => {
      return localizacao;
    });

    if (!this.localizacao) {
      this.alertService.warn('Por favor habilite a localização para podermos registrar sua presença');
      this.carregado = true;
      return;
    }

    if (this.calcularDistancia(this.localizacao) > 0.7) {
      this.alertService.error('Você não pode registrar sua presença pois está a mais de 700m da Unicid.');
      this.carregado = true;

      this.mapOptions = {
        center: {
          lat: this.localizacao.latitude,
          lng: this.localizacao.longitude
        },
        zoom: 14,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      }

      this.markers.push({
        position: { lat: this.localizacao.latitude, lng: this.localizacao.longitude }
      });

      this.exibirMapa = true;

      return;
    }

    if (this.isProfessor) {
      this.aulasService.getAllByProfessor().subscribe({
        next: aulas => {
          this.carregado = true;

          this.aulas = aulas;

          this.ValidarAula();
        },
        error: e => {
          this.carregado = true;

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
      this.presencaService.getAllByAluno()
        .pipe(first())
        .subscribe(
          aulas => {
            this.carregado = true;

            this.aulas = aulas;

            let dateAgora = new Date(Date.now()).toLocaleString();

            this.aulas.map(a => {
              if (dateAgora >= new Date(a.inicio).toLocaleString() && dateAgora <= new Date(a.fim).toLocaleString()) {
                this.presencaValidada = true;
                return;
              }
            })

            if (!this.presencaValidada) {
              this.habilitarLerQrCode = true;
            }
          },
          error => {
            this.carregado = true;

            this.alertService.error(error);
          });
    }
  }

  private ValidarAula() {
    let horaAtual = new Date(Date.now()).toLocaleString();

    const aulaAtual = this.aulas.find(a => horaAtual >= new Date(a.inicio).toLocaleString() && horaAtual <= new Date(a.fim).toLocaleString())

    if (aulaAtual) {
      this.valueQRCode = `${aulaAtual.idAula}`;

      this.exibirQRCode = true;
      this.aulaAtual = false;
    }
    else {
      this.exibirQRCode = false;
      this.aulaAtual = true;

      this.cursoService.getAllCursosByProfessor().subscribe({
        next: cursos => {
          this.cursosProfessor = cursos;
        },
        error: e => {
          this.alertService.error(e);
        }
      });
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

      this.aulasService.cadastro(this.form.value).subscribe({
        next: aula => {
          this.valueQRCode = `${aula.idAula}`;

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

  PreencherMaterias(curso: Curso) {
    this.materias = this.cursosProfessor.find(c => c.id === curso.id)!.materias
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }

  lerQRCode(resultString: string) {
    this.qrCodeLido = true;

    this.presencaService.cadastro(parseInt(resultString)).subscribe({
      next: () => {
        this.alertService.success('presença validada');
        this.presencaValidada = true;
      },
      error: e => {
        this.alertService.error(e);
        this.qrCodeLido = false;
        this.scannerAtivo = false;
      }
    });

  }

  HabilitarScanner() {
    this.scannerAtivo = true;
  }

  onHasPermission(resposta: any) {
    this.hasPermission = resposta;
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.hasCameras = Boolean(devices && devices.length);
  }

  private calcularDistancia(localizacaoUser: Localizacao): number {

    var R = 6371; // radio da terra em km
    var dLat = this.deg2rad(this.localizacaoUnicid.latitude - localizacaoUser.latitude);  // deg2rad below
    var dLon = this.deg2rad(this.localizacaoUnicid.longitude - localizacaoUser.longitude);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(localizacaoUser.latitude)) * Math.cos(this.deg2rad(this.localizacaoUnicid.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distancia = R * c; // Distance em km
    return distancia;
  }

  private deg2rad(deg: number) {
    return deg * (Math.PI / 180)
  }
}



