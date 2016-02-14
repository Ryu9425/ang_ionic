import {App} from '../../../../../ionic/ionic';
import {
  Control,
  ControlGroup,
  NgForm,
  Validators,
  NgControl,
  ControlValueAccessor,
  NgControlName,
  NgFormModel,
  FormBuilder
} from 'angular2/common';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  fruitsForm: ControlGroup;
  grapeDisabled: boolean;
  grapeChecked: boolean;
  kiwiModel: boolean;
  strawberryModel: boolean;
  standAloneChecked: boolean;
  formResults: string;

  constructor() {
    this.fruitsForm = new ControlGroup({
      "appleCtrl": new Control(true),
      "bananaCtrl": new Control(true),
      "cherryCtrl": new Control(false),
      "grapeCtrl": new Control(true)
    });

    this.grapeDisabled = true;
    this.grapeChecked = true;
    this.standAloneChecked = true;

    this.kiwiModel = false;
    this.strawberryModel = true;
  }

  toggleGrapeChecked() {
    this.grapeChecked = !this.grapeChecked;
  }

  toggleGrapeDisabled() {
    this.grapeDisabled = !this.grapeDisabled;
  }

  doSubmit(ev) {
    console.log('Submitting form', this.fruitsForm.value);
    this.formResults = JSON.stringify(this.fruitsForm.value);
    ev.preventDefault();
  }
}
