import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/core';
import {AndroidAttribute} from '../../helpers';

@Page({
    templateUrl: 'slides/basic/template.html',
    directives: [forwardRef(() => AndroidAttribute)]
})
export class BasicPage {
  constructor() {

  }
}
