import { Injectable } from '@angular/core';
import { Localizacao } from '../models/localizacao';

@Injectable({
  providedIn: 'root'
})
export class LocalizacaoService {

  constructor() { }

  getLocation(): Promise<Localizacao | undefined> {
    return new Promise<Localizacao | undefined>((resolve) => {
      const navigatorLocationOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      /* Determine browser permissions status */
      navigator.permissions.query({ name: 'geolocation' })
        .then((result) => {
          /* result.state will be 'granted', 'denied', or 'error' */
          if (result.state.toLowerCase() === 'denied') {
            resolve(undefined);
          }
          // } else {
          //   /* Browser location services disabled or error */
          //   console.log('Browser location services disabled', navigator);
          //   resolve(undefined);
          // }
        }, (error) => {
          /* Browser doesn't support querying for permissions */
          console.log('Browser permissions services unavailable', navigator);
          resolve(undefined);
        }
        );

      setTimeout(function () {
        navigator.geolocation.getCurrentPosition(position => {
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;
          resolve(new Localizacao(latitude, longitude));

        }, (error) => {
          /* System/OS location services disabled */
          console.log('System/OS services disabled', navigator);
          resolve(undefined);
        }, navigatorLocationOptions);
      });


    });
  }
}
