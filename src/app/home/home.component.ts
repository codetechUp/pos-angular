import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as data from './../datas/admin.json';
import { FormGroup, FormControl } from '@angular/forms';
import { DataServiceService } from '../datas/data-service.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  json: any = data;

  error: any;
  constructor(private router: Router,private http: HttpClient,private dataService: DataServiceService) { }

  ngOnInit(): void {

  }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    const admin=this.dataService.getAdmin();
    const value =this.loginForm.value;
    const username=admin.username;
    const password=admin.password;

    if( value.username === username && value.password === password){
     console.log('u are logged');
     this.router.navigateByUrl('/detail');
    }else{
      this.error='Identifiants incorrects';
    }
  }

}
