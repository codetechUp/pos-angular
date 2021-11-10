import { Injectable } from '@angular/core';
import * as admin from './admin.json';
import * as dibi from './dibiterie.json';
@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor() { }

  getAllDibi(){
   return dibi;
  }
  getAdmin(){
    return admin;
  }

}


