import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import * as Compressor from 'compressorjs';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'ngx-picture-upload',
  templateUrl: './picture-upload.component.html',
  styleUrls: ['./picture-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PictureUploadComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PictureUploadComponent implements OnInit, ControlValueAccessor, OnDestroy, OnChanges {
  private readonly subscription: Subscription = new Subscription();
  private onTouched: (() => void) | undefined;
  private onChange: ((img: string | null) => void) | undefined;

  private readonly imagesFlow: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  readonly imagesFlow$: Observable<string | null> = this.imagesFlow.asObservable();

  @Input() disabled?: boolean;
  @Input() maxWidth: number = 0;
  @Input() minWidth: number = 0;
  @Input() type: string = 'image/jpeg';

  @Input() color?: { background?: string, text?: string, border?: string, icon?: string, button?: string };

  @Input() set quality(val: number) {
    if (val < 0) {
      this._quality = 0.0;
    } else if (val > 1.0) {
      this._quality = 1.0;
    } else {
      this._quality = val;
    }
  }

  _quality: number = 1;

  @HostListener('click') hostTouched(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  constructor(private changeDetector: ChangeDetectorRef,
              private ngZone: NgZone,
              private renderer: Renderer2,
              private el: ElementRef<HTMLElement>) {
  }

  ngOnInit(): void {
    this.subscription.add(
      this.imagesFlow$.subscribe((image: string | null): void => {
        this.ngZone.run(() => {
          if (this.onChange) {
            this.onChange(image);
          }
          if (this.onTouched) {
            this.onTouched();
          }
        });
      }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    const disabledKey: keyof PictureUploadComponent = 'disabled';

    if (changes[disabledKey] && !changes[disabledKey].isFirstChange()) {
      this._setDisabledCss(changes[disabledKey].currentValue)
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private imageCompressor(event: Event): void {
    this.ngZone.runOutsideAngular((): void => {
      const fileList: FileList | null = (event.target as HTMLInputElement).files;

      if (!fileList || fileList.length === 0) {
        return;
      }

      const file: File = fileList[0];

      new Compressor.default(file, {
        quality: this._quality,
        minWidth: this.minWidth,
        maxWidth: this.maxWidth,
        mimeType: this.type,
        strict: false,
        success: (result: File | Blob): void => {
          if (typeof (FileReader) !== 'undefined') {
            const reader: FileReader = new FileReader();

            reader.onload = (e: any): void => {
              try {
                this.imagesFlow.next(btoa(e.target.result));
                this.changeDetector.detectChanges();
              } catch (e) {
                console.error(e);
                this.imagesFlow.next(null);
              }
            };
            reader.readAsBinaryString(result);
          } else {
            console.error('FileReader unavailable')
            this.imagesFlow.next(null);
          }
        },
        error: (err: Error): void => {
          console.error(err);
          this.imagesFlow.next(null);
        },
      });
    });
  }

  private _setDisabledCss(v: boolean): void {
    if (v) {
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.5')
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'not-allowed')
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'initial')
    }
    this.changeDetector.detectChanges()
  }

  registerOnChange(fn: (img: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(obj: string): void {
    this.imagesFlow.next(obj);
    this.changeDetector.detectChanges();
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._setDisabledCss(isDisabled);
  }

  onFileSelected(event: Event): void {
    this.imageCompressor(event);
    (event.target as HTMLInputElement).value = '';
  }

  delete(): void {
    this.imagesFlow.next(null);
  }
}
