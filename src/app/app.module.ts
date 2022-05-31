import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {PictureUploadModule} from "projects/picture-upload/src/lib/picture-upload.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PictureUploadModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatInputModule,
    PictureUploadModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
