/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DataServiceService } from '../datas/data-service.service';
import { DibiInterface } from '../datas/dibi-interface';
import dibiData from './../datas/dibiterie.json';
import { CommandeInterface } from '../datas/commande-interface';
import commandeData from './../datas/commande.json';
import { SettingInterface } from '../datas/setting-interface';
import settingData from './../datas/settings.json';
import { CategorieInterface } from '../datas/categories-interface';
import categorieData from './../datas/categories.json';
import { ProduitInterface } from '../datas/produit-inteface';
import produitData from './../datas/produits.json';
import vitrineData from './../datas/vitrine.json';
import { OnChanges } from '@angular/core';
import { NgZone } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';
import Swal from 'sweetalert2';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {PosPrinter, PosPrintData, PosPrintOptions} from 'electron-pos-printer';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';





@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit , OnChanges{
  productForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    file: new FormControl('', [Validators.required]),
    prix: new FormControl(),
    categorieP: new FormControl('', [Validators.required]),
    imgSrc: new FormControl('', [Validators.required])
  });
  datas: ProduitInterface[];
  data: ProduitInterface[]=[];
  newCat: string;
  fs: typeof fs;
 printer: typeof PosPrinter;
  total: number= 0;
  dibi: DibiInterface[] = [] ;
  categories: CategorieInterface[] ;
  categorie: CategorieInterface= {
    id :undefined,
    nom:undefined
  };
  setting: SettingInterface ;
  // dibis: ProduitInterface[] ;
  dibis: DibiInterface[] ;
  vitrines: DibiInterface[] ;
  order: CommandeInterface= {
    id :undefined,
    items:[],
    total:0
  };
  allOrder: CommandeInterface[];
  product: ProduitInterface= {
    id :undefined,
    nom :undefined,
    prix :undefined,

  };
  allProduct: ProduitInterface[];
  options: PosPrintOptions = {
    preview: true,
    width: '1170px',
    margin: '0 0 0 0',
    copies: 1,
    printerName: 'XP-80C',
    timeOutPerLine: 1000,
    pageSize: { height: 325555, width: 12000 } // page size
 };
 dataaa: PosPrintData[]=[
  {
    type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
    value: 'SAMPLE HEADING',
    style: `text-align:center;`,
    css: {'font-weight': '700', 'font-size': '18px'}
 },{
    type: 'text',                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
    value: 'Secondary text',
    style: `text-align:left;color: red;`,
    css: {'text-decoration': 'underline', 'font-size': '10px'}
 },{
  type: 'table',
  // style the table
  style: 'border: 1px solid #ddd',
  // list of the columns to be rendered in the table header
  tableHeader: ['Animal', 'Age'],
  // multi dimensional array depicting the rows and columns of the table body
  tableBody: [
      ['Cat', '2'],
      ['Dog', '4'],
      ['Horse', '12'],
      ['Pig', '4'],
  ],
  // list of columns to be rendered in the table footer
  tableFooter: ['Animal', 'Age'],
  // custom style for the table header
  tableHeaderStyle: 'background-color: #000; color: white;',
  // custom style for the table body
  tableBodyStyle: 'border: 0.5px solid #ddd',
  // custom style for the table footer
  tableFooterStyle: 'background-color: #000; color: white;',
},
 ];

  constructor(private dataService: DataServiceService,private zone: NgZone,private http: HttpClient) {

  }

  ngOnInit(): void {

    this.vitrines=vitrineData;
    this.setting=settingData;
    this.categories = categorieData;
    this.allProduct = produitData;

   const fstCategorie=this.categories[0].nom;
    this.datas= this.allProduct.filter(opt => opt.categorie === fstCategorie);

   }
   getData(categorie){
    this.zone.run(() => {


       this.datas= this.allProduct.filter(opt => opt.categorie === categorie);
   });
  }
  addOrder(value){

    const selectedOrder = this.getSelectedOrder(value);
     console.log(selectedOrder);
    this.zone.run(() => {


      this.data.push(selectedOrder);
      this.total =0;
      for (const x of this.data) {
      this.total+=x.prix;

    }

    });
   this.order.id=this.getMyId();
   this.order.total=this.total;
   this.order.items=this.data;

console.log(this.data);
 //  this.fs = (<any>window).require('fs');
 //  const rawdata = this.fs.readFileSync('src/app/datas/dibiterie.json');

//const student = JSON.parse(rawdata.toString());
//console.log(student);

//const data = JSON.stringify(commandeData);
//this.fs.writeFileSync('src/app/datas/dibiterie.json', data);



}



  getTheOrder(){
    return this.dibi;
  }
  getMyId(){
    this.allOrder=commandeData;
    if(this.allOrder.length)
    {return this.allOrder.length;}
    else{ return 0;}
  }
  getMyIdd(array){

    if(array.length)
    {return array.length;}
    else{ return 0;}
  }
  onFileChange(event) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.productForm.patchValue({
        imgSrc: file
      });
     const reader=new FileReader();
     reader.addEventListener('load',()=>{
      this.fs = (<any>window).require('fs');
      const img=reader.result;
      const data = img.toString().replace(/^data:image\/\w+;base64,/, '');
const buf = Buffer.from(data, 'base64');
this.fs.writeFile('src/app/datas/image.png', buf,(e)=>{
  console.log(e);
});
     });
     reader.readAsDataURL(file);

     //console.log(file);



    }
  }

  addCommande(){
    const printer = (<any>window).require('@electron/remote').require('electron-pos-printer');
  this.fs = (<any>window).require('fs');
  this.allOrder=commandeData;
  this.allOrder.push(this.order);

 this.fs.writeFile('src/app/datas/commande.json', JSON.stringify(this.allOrder),(e)=>{console.log(console.log(e));
 });
 Swal.fire(
  'Coool!',
  'Ajoute avec success!',
  'success'
);

//printer.PosPrinter.print(this.data, this.options)
 //.then(() => {
 //  console.log('goood');
// })
 //.catch((error) => {
 //   console.error(error);
 // });
   // this.allOrder=commandeData;
   // this.allOrder.push(this.order);
//
 //  this.fs.writeFile('src/app/datas/commande.json', JSON.stringify(this.allOrder),(e)=>{console.log(console.log(e));
  // });
  }
  deleteItem(e){
    const selectedOrder = this.datas.find(opt => opt.id === e);
    this.zone.run(() => {
    this.data.splice(e,1);
    this.total=0;
    for (const x of this.data) {
      this.total+=x.prix;

    }

  });

  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }
  getSelectedOrder(value){

      return this.datas.find(opt => opt.id === value);

  }
  saveSetting(){
    console.log(this.setting);
    this.fs = (<any>window).require('fs');

  this.fs.writeFile('src/app/datas/settings.json', JSON.stringify(this.setting),(e)=>{console.log(console.log(e));
    Swal.fire(
      'Coool!',
      'Sauvegarder avec success!',
      'success'
  );
  });
  }
  addCategorie(){

    if((this.newCat === undefined) ){

      Swal.fire(
        'Ooops!',
        'Le champs vide!',
        'warning'
    );
    }else{
      this.fs = (<any>window).require('fs');
    this.categorie.nom=this.newCat;
    this.categories=categorieData;
    this.categorie.id=this.getMyIdd(this.categories);
    this.categories=categorieData;
    this.categories.push(this.categorie);
      this.fs.writeFile('src/app/datas/categories.json', JSON.stringify(this.categories),(e)=>{console.log(console.log(e));
      });
      this.newCat=undefined;
      this.categorie={};
      Swal.fire(
        'Coool!',
        'Ajoute avec success!',
        'success'
    );
    }

  }
  addProduct(){
    const data=this.productForm.value;
    console.log(data);
   /** this.fs = (<any>window).require('fs');
    this.product.id=this.getMyIdd(this.allProduct);

    this.product.prix=parseInt(this.productForm.value.prix, 10);
    this.product.nom=data.name;
    console.log(this.categories.find(opt => opt.id === data.categorieP));
    this.product.categorie=data.categorieP;
    this.allProduct.push(this.product);
    this.fs.writeFile('src/app/datas/produits.json', JSON.stringify(this.allProduct),(e)=>{console.log(console.log(e));
    });

    Swal.fire(
      'Coool!',
      'Ajoute avec success!',
      'success'
  ); */
  }
 editCategorie(){

     $('#Categories').modal('hide');
     $('#newCategory').modal('show');
 }

}


