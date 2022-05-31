import {NgModule} from '@angular/core';
import {PictureUploadComponent} from './picture-upload.component';
import {DisplayBase64ImageDirective} from "./display-correct-image.directive";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    PictureUploadComponent,
    DisplayBase64ImageDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PictureUploadComponent,
    DisplayBase64ImageDirective
  ]
})
export class PictureUploadModule {
}
