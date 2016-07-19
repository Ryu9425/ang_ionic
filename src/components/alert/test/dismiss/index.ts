import { Component } from '@angular/core';
import { ionicBootstrap, AlertController, LoadingController, NavController } from '../../../../index';
import { FormBuilder, ControlGroup, Validators } from '@angular/common';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {

  constructor(private alertCtrl: AlertController, private nav: NavController) {}

  submit() {
    var alert = this.alertCtrl.create({
      title: 'Not logged in',
      message: 'Sign in to continue.',
      buttons: [
        {
          text: 'Sign in',
          handler: () => {
            console.log('Sign in');
          }
        }
      ]
    });

    alert.onDidDismiss(() => {
      console.log('dismiss');
      this.nav.push(AnotherPage);
    });

    alert.present();
  }
}

@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Another Page</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>
      <form [formGroup]="form" (ngSubmit)="submit(form.value)">
        <ion-list>
          <ion-item [class.error]="!form.controls.name.valid && form.controls.name.touched">
            <ion-label>Name</ion-label>
            <ion-input type="text" [(formControl)]="form.controls.name"></ion-input>
          </ion-item>
        </ion-list>
        <div padding style="padding-top: 0 !important;">
          <button list-item primary block>
            Submit
          </button>
        </div>
      </form>
      <p>
        <button block (click)="doFastPop()">Fast Loading Dismiss, Nav Pop</button>
      </p>
    </ion-content>
  `
})
class AnotherPage {
  form: ControlGroup;

  constructor(private nav: NavController, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private builder: FormBuilder) {
    this.form = builder.group({
      name: builder.control('', Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ]))
    });
  }

  submit(value: any): void {
    if (this.form.valid) {
      console.log(value);

    } else {
      this.alertCtrl.create({
        title: 'Invalid input data',
        subTitle: 'Please correct the errors and resubmit the data.',
        buttons: ['OK']
      }).present();
    }
  }

  ionViewDidEnter() {
    this.showConfirm();
  }

  showConfirm() {
    const alert = this.alertCtrl.create({
      title: `Hi there`,
      buttons: [
        {
          text: 'Go Back',
          role: 'cancel',
          handler: () => {
            alert.dismiss().then(() => {
              this.nav.pop();
            });
            return false;
          }
        },
        {
          text: 'Stay Here',
          handler: () => {
            console.log('Stay Here');
          }
        }
      ]
    });
    alert.present();
  }

  doFastPop() {
    let alert = this.alertCtrl.create({
      title: 'Async Nav Transition',
      message: 'This is an example of dismissing an alert, then quickly starting another transition on the same nav controller.',
      buttons: [{
        text: 'Ok',
        handler: () => {
          // present a loading indicator
          let loading = this.loadingCtrl.create({
            content: 'Loading...'
          });
          loading.present();

          // start an async operation
          setTimeout(() => {
            // the async operation has completed
            // dismiss the loading indicator
            loading.dismiss();

            // begin dismissing the alert
            alert.dismiss().then(() => {
              // after the alert has been dismissed
              // then you can do another nav transition
              this.nav.pop();
            });
          }, 100);

          // return false so the alert doesn't automatically
          // dismissed itself. Instead we're manually
          // handling the dismiss logic above so that we
          // can wait for the alert to finish it's dismiss
          // transition before starting another nav transition
          // on the same nav controller
          return false;
        }
      }]
    });
    alert.present();
  }

}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = E2EPage;
}

ionicBootstrap(E2EApp);
