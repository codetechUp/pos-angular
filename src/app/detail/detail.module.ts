import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailRoutingModule } from './detail-routing.module';

import { DetailComponent } from './detail.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPrintModule} from 'ngx-print';
import { HttpClientModule, HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [DetailComponent],
  imports: [FormsModule, ReactiveFormsModule ,HttpClientModule, NgxPrintModule ,CommonModule, SharedModule, DetailRoutingModule]
})
export class DetailModule {}
