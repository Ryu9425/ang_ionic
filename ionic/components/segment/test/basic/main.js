import {Component, View, bootstrap} from 'angular2/angular2'
import {FormBuilder, Validators, FormDirectives, ControlGroup} from 'angular2/forms';
import {IONIC_DIRECTIVES} from 'ionic/ionic'

@Component({ selector: '[ion-app]' })
@View({
  templateUrl: 'main.html',
  directives: [FormDirectives].concat(IONIC_DIRECTIVES)
})
class IonicApp {
  constructor() {
  }
}

bootstrap(IonicApp)
