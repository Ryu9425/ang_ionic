import { Directive, forwardRef } from '@angular/core';
import { MinValidator as NgMinValidator, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: 'ion-input[type=number][min][formControlName],ion-input[type=number][min][formControl],ion-input[type=number][min][ngModel]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MinValidator),
    multi: true
  }],
  host: {'[attr.min]': 'min ?? null'}
})

export class MinValidator extends NgMinValidator {
  constructor() { super(); console.log('hello world') }
}
