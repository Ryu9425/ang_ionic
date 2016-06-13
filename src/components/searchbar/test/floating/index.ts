import {Component, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EApp {
  defaultSearch: string = 'test';
  customPlaceholder: number = 2;
  defaultCancel: string = '';

  isAutocorrect: string = 'on';
  isAutocomplete: string = 'on';
  isSpellcheck: boolean = true;

  constructor(private changeDetectorRef: ChangeDetectorRef) {

  }

  onClearSearchbar(ev: any) {
    console.log("ionClear", ev.target.value);
  }

  onCancelSearchbar(ev: any) {
    console.log("ionCancel", ev.target.value);
  }

  triggerInput(ev: any) {
    console.log("ionInput", ev.target.value);
  }

  inputBlurred(ev: any) {
    console.log("ionBlur", ev.target.value);
  }

  inputFocused(ev: any) {
    console.log("ionFocus", ev.target.value);
  }

  ngAfterViewInit() {
    this.customPlaceholder = 33;
    this.changeDetectorRef.detectChanges();
  }

  changeValue() {
    this.defaultSearch = "changed";
  }
}

ionicBootstrap(E2EApp);
