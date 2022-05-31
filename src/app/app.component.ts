import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  formGroup: FormGroup = new FormGroup({
    quality: new FormControl(1, [Validators.required, Validators.min(0), Validators.max(1)]),
    minWidth: new FormControl(0, [Validators.min(0), Validators.max(Number.MAX_SAFE_INTEGER)]),
    maxWidth: new FormControl(0, [Validators.min(0), Validators.max(Number.MAX_SAFE_INTEGER)]),
    picture: new FormControl(null)
  });
}
