import {Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

const isBase64 = (str: string): boolean => {
  let base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  return base64regex.test(str);
}

@Directive({
  selector: '[displayBase64Image]'
})
export class DisplayBase64ImageDirective implements OnInit, OnChanges {
  @Input() type: string = 'image/jpeg';
  @Input() src: string | undefined;

  constructor(private elementRef: ElementRef<HTMLImageElement>) {
  }

  ngOnInit(): void {
    if (this.src) {
      this.elementRef.nativeElement.src = this.decodeBase64(this.src, this.type)
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const srcKey: keyof DisplayBase64ImageDirective = 'src';

    if (changes[srcKey] && !changes[srcKey].isFirstChange()) {
      this.elementRef.nativeElement.src = this.decodeBase64(changes[srcKey].currentValue, this.type)
    }
  }

  decodeBase64(src: string, type: string): string {
    if (isBase64(src)) {
      return `data:${type};base64,${this.src}`;
    }
    return src;
  }
}
