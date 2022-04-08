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

  @ViewChild('scanner')
  scanner: ZXingScannerComponent = new ZXingScannerComponent();

  hasCameras = false;
  hasPermission!: boolean;
  qrResultString!: string;

  availableFormats = [BarcodeFormat.QR_CODE];

  availableDevices!: MediaDeviceInfo[];
  selectedDevice!: MediaDeviceInfo;

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

    if (this.isAluno) {
      this.InicializarEventosScanner();
    }
  }

  private InicializarEventosScanner() {
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasCameras = true;

      console.log('Devices: ', devices);
      this.availableDevices = devices;

      // selects the devices's back camera by default
      // for (const device of devices) {
      //     if (/back|rear|environment/gi.test(device.label)) {
      //         this.scanner.changeDevice(device);
      //         this.selectedDevice = device;
      //         break;
      //     }
      // }
    });

    this.scanner.camerasNotFound.subscribe((devices: MediaDeviceInfo[]) => {
      console.error('An error has occurred when trying to enumerate your video-stream-enabled devices.');
    });

    this.scanner.permissionResponse.subscribe((answer: boolean) => {
      this.hasPermission = answer;
    });
  }

  criarAula(): void {
    console.log(this.form.value)
  }

  PreencherMaterias(event: any) {
    this.materias = this.user.curso.find(c => c.id === parseInt(event.target.value))!.materias;
  }


  handleQrCodeResult(resultString: string) {
    console.log('Result: ', resultString);
    this.qrResultString = resultString;
  }

  onDeviceSelectChange(event: any) {
    // console.log('Selection changed: ', event.target.value);
    // this.selectedDevice = this.scanner.deviceChange
  }
}



