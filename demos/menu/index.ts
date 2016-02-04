import {App, IonicApp, Page} from 'ionic/ionic';


@Page({templateUrl: 'page1.html'})
class Page1 {}


@Page({templateUrl: 'page2.html'})
class Page2 {}

@App({
  templateUrl: 'main.html'
})
class ApiDemoApp {
  constructor(app: IonicApp) {
    this.app = app;
    this.rootView = Page1;

    this.pages = [
      { title: 'Page 1', component: Page1 },
      { title: 'Page 2', component: Page2 },
    ];
  }

  openPage(menu, page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
  }
}
