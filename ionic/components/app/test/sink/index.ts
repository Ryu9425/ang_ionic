import {Component, Directive} from 'angular2/angular2';

import {IonicApp, IonicView, Register} from 'ionic/ionic';

import {ButtonPage} from './pages/button'
import {NavPage} from './pages/nav'
import {ListPage} from './pages/list'
import {ListGroupPage} from './pages/list-group'
import {CardPage} from './pages/card'
import {FormPage} from './pages/form'
import {SegmentPage} from './pages/segment'
import {SearchBarPage} from './pages/search-bar'
import {TableSearchPage} from './pages/table-search'
import {IconsPage} from './pages/ionicons'
import {TabsPage} from './pages/tabs'
import {AsidePage} from './pages/aside'
import {AnimationPage} from './pages/animation'
import {SlidePage} from './pages/slides'
import {ActionMenuPage} from './pages/action-menu'
import {ModalPage} from './pages/modal'


@Component({
  selector: 'ion-app',
})
@IonicView({
  templateUrl: 'main.html',
  directives: [Register]
})
class MyApp {
  constructor(app: IonicApp) {
    this.app = app;

    this.components = [
      { title: 'Navigation', component: NavPage },
      { title: 'Buttons', component: ButtonPage },
      { title: 'Lists', component: ListPage },
      { title: 'List Groups', component: ListGroupPage },
      { title: 'Cards', component: CardPage },
      { title: 'Forms', component: FormPage },
      { title: 'Segments', component: SegmentPage },
      { title: 'Search Bar', component: SearchBarPage },
      { title: 'Table Search', component: TableSearchPage },
      { title: 'Icons', component: IconsPage },
      { title: 'Tabs', component: TabsPage },
      { title: 'Aside', component: AsidePage },
      { title: 'Animation', component: AnimationPage },
      { title: 'Slides', component: SlidePage},
      { title: 'Action Menu', component: ActionMenuPage },
      { title: 'Modal', component: ModalPage }
    ];

    this.rootView = ButtonPage
  }

  openPage(aside, component) {
    aside.close();

    let nav = this.app.getComponent('myNav');
    nav.setRoot(component.component);
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(MyApp);
}
