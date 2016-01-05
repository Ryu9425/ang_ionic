import {Page, Alert, NavController} from 'ionic/ionic';
import {AndroidAttribute} from '../../helpers';
import {forwardRef} from 'angular2/core';


@Page({
    templateUrl: 'alerts/basic/template.html',
    directives: [forwardRef(() => AndroidAttribute)]
})
export class BasicPage {

  constructor(nav: NavController) {
    this.nav = nav;
  }

  doAlert() {
    let alert = Alert.create({
      title: "New Friend!",
      subTitle: "Your friend, Obi wan Kenobi, just accepted your friend request!",
      buttons: ['Ok']
    });
    this.nav.present(alert);
  }

  // doPrompt() {
  //   this.popup.prompt({
  //     title: "New Album",
  //     template: "Enter a name for this new album you're so keen on adding",
  //     inputPlaceholder: "Title",
  //     okText: "Save"
  //   });
  // }

  // doConfirm() {
  //   this.popup.confirm({
  //     title: "Use this lightsaber?",
  //     template: "Do you agree to use this lightsaber to do good across the intergalactic galaxy?",
  //     cancelText: "Disagree",
  //     okText: "Agree"
  //   });
  // }

  // onPageWillLeave() {
  //   let popup = this.popup.get();
  //   // only try to close if there is an active popup
  //   if (popup) {
  //     popup.close();
  //   }
  // }

}
