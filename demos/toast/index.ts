import { Component } from '@angular/core';

import { ionicBootstrap, ToastController } from 'ionic-angular';


@Component({
  templateUrl: 'main.html'
})
class ApiDemoPage {
  constructor(private toastCtrl: ToastController) { }

  showToast(position: string) {
    const toast = this.toastCtrl.create({
      message: 'User was created successfully',
      position: position,
      duration: 3000
    });

    toast.onDismiss(this.dismissHandler);
    toast.present();
  }

  showLongToast() {
    const toast = this.toastCtrl.create({
      message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea voluptatibus quibusdam eum nihil optio, ullam accusamus magni, nobis suscipit reprehenderit, sequi quam amet impedit. Accusamus dolorem voluptates laborum dolor obcaecati.',
      duration: 3000
    });

    toast.onDismiss(this.dismissHandler);
    toast.present();
  }

  showDismissDurationToast() {
    const toast = this.toastCtrl.create({
      message: 'I am dismissed after 1.5 seconds',
      duration: 1500
    });
    toast.onDismiss(this.dismissHandler);
    toast.present();
  }

  showToastWithCloseButton() {
    const toast = this.toastCtrl.create({
      message: 'Your internet connection appears to be offline. Data integrity is not guaranteed.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.onDismiss(this.dismissHandler);
    toast.present();
  }

  private dismissHandler() {
    console.info('Toast onDismiss()');
  }

}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class ApiDemoApp {
  root = ApiDemoPage;
}

ionicBootstrap(ApiDemoApp);
