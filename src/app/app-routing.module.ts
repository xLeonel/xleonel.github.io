import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { TipoUser } from './models/user';
import { AddEditComponent } from './pages/add-edit/add-edit.component';
import { AlunosComponent } from './pages/alunos/alunos.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfessoresComponent } from './pages/professores/professores.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'alunos', component: AlunosComponent, canActivate: [AuthGuard], data: { permissao: [TipoUser.adm] } },
  { path: 'alunos/editar/:id', component: AddEditComponent, canActivate: [AuthGuard], data: { permissao: [TipoUser.adm], tipoExibicao: TipoUser.aluno } },
  { path: 'alunos/cadastro', component: AddEditComponent, canActivate: [AuthGuard], data: { permissao: [TipoUser.adm], tipoExibicao: TipoUser.aluno } },
  { path: 'professores', component: ProfessoresComponent, canActivate: [AuthGuard], data: { permissao: [TipoUser.adm] } },
  { path: 'professores/editar/:id', component: AddEditComponent, canActivate: [AuthGuard], data: { permissao: [TipoUser.adm], tipoExibicao: TipoUser.professor } },
  { path: 'professores/cadastro', component: AddEditComponent, canActivate: [AuthGuard], data: { permissao: [TipoUser.adm], tipoExibicao: TipoUser.professor } },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
