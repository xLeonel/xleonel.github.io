import { Pipe, PipeTransform } from '@angular/core';
import { TipoUser } from '../models/user';

@Pipe({
  name: 'trataTipoUser'
})
export class TrataTipoUserPipe implements PipeTransform {

  transform(value: TipoUser): unknown {
    switch (value) {
      case TipoUser.adm:
        return 'Administrador';
      case TipoUser.aluno:
        return 'Aluno';
      case TipoUser.professor:
        return 'Professor(a)';
    }
  }

}
