import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { HomeComponent } from './pages/home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './auth/jwt.interceptor';
import { ErrorInterceptor } from './auth/error.interceptor';
import { AlertaComponent } from './components/alerta/alerta.component';
import { TrataTipoUserPipe } from './pipes/trata-tipo-user.pipe';
import { AlunosComponent } from './pages/alunos/alunos.component';
import { AddEditComponent } from './pages/add-edit/add-edit.component';
import { ProfessoresComponent } from './pages/professores/professores.component';
import { AulasComponent } from './pages/aulas/aulas.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QRCodeModule } from 'angularx-qrcode';
import { PresencaComponent } from './pages/presenca/presenca.component';
import { RecuperarSenhaComponent } from './pages/recuperar-senha/recuperar-senha.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    CadastroComponent,
    HomeComponent,
    AlertaComponent,
    TrataTipoUserPipe,
    AlunosComponent,
    AddEditComponent,
    ProfessoresComponent,
    AulasComponent,
    PresencaComponent,
    RecuperarSenhaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    ZXingScannerModule,
    QRCodeModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }