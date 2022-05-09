import { Injectable } from '@angular/core';
import { Localizacao } from '../models/localizacao';

@Injectable({
  providedIn: 'root'
})
export class LocalizacaoService {

  constructor() { }

  getLocation(): Promise<Localizacao | undefined> {
    return new Promise<Localizacao | undefined>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(Error('No support for geolocation'));
        return;
      }

      navigator.permissions.query({ name: 'geolocation' })
        .then((perm) => {
          if (perm.state.toLowerCase() === 'denied') {
            resolve(undefined);
          }
        })

      navigator.geolocation.getCurrentPosition((position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        resolve(new Localizacao(latitude, longitude));
      });
    });
  }
}
