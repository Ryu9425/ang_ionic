import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {IonicComponent} from 'ionic/config/component'


@Component({
  selector: 'ion-list, [ion-list]'
})
@View({
  template: `<content></content>`
})
export class List {
  constructor() {

  }
}

// new IonicComponent(List, {
//   propClasses: ['inset']
// })
