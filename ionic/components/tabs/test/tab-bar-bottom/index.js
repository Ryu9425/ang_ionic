import {bootstrap} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Tabs, Tab} from 'ionic/ionic';


@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Tabs, Tab]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}


export function main() {
  bootstrap(IonicApp);
}
