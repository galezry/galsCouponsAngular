import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DevService {

  public _isDevMode: boolean = true;

  constructor() { }

  get isDevMode(): boolean {
    return this._isDevMode;
  }

  set isDevMode(value: boolean) {
    this._isDevMode = value;
  }


}


