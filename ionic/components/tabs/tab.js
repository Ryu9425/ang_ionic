import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Directive, Component, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {Injector} from 'angular2/di';

import {ViewController} from '../view/view-controller';
import {ViewItem} from '../view/view-item';
import {Tabs} from './tabs';


@Component({
  selector: 'ion-tab',
  properties: [
    'root',
    'tabTitle',
    'tabIcon'
  ],
  host: {
    '[attr.id]': 'panelId',
    '[attr.aria-labelledby]': 'labeledBy',
    '[attr.aria-hidden]': 'isNotSelected',
    '[class.tab-selected]': 'isSelected',
    'role': 'tabpanel'
  }
})
@View({
  template: '<template pane-anchor></template><content></content>',
  directives: [TabPaneAnchor]
})
export class Tab extends ViewController {

  constructor(
    @Parent() tabs: Tabs,
    elementRef: ElementRef,
    injector: Injector
  ) {
    // A Tab is both a container of many views, and is a view itself.
    // A Tab is one ViewItem within it's parent Tabs (which extends ViewController)
    // A Tab is a ViewController for its child ViewItems
    super(tabs, injector);
    this.tabs = tabs;

    this.childNavbar(true);

    let item = this.item = new ViewItem(tabs.parent);
    item.setInstance(this);
    item.viewElement(elementRef.nativeElement);
    tabs.addTab(this);

    this.navbarView = item.navbarView = () => {
      let activeItem = this.getActive();
      return activeItem && activeItem.navbarView();
    };

    item.enableBack = () => {
      // override ViewItem's enableBack(), should use the
      // active child nav item's enableBack() instead
      let activeItem = this.getActive();
      return (activeItem && activeItem.enableBack());
    };

    this.panelId = 'tab-panel-' + item.id;
    this.labeledBy = 'tab-button-' + item.id;
  }

  onInit() {
    if (this._initialResolve) {
      this.tabs.select(this).then(() => {
        this._initialResolve();
        this._initialResolve = null;
      });
    }
  }

  load(callback) {
    if (!this._loaded && this.root) {
      let opts = {
        animate: false,
        navbar: false
      };
      this.push(this.root, null, opts).then(() => {
        callback && callback();
      });
      this._loaded = true;

    } else {
      callback && callback();
    }
  }

  queueInitial() {
    // this Tab will be used as the initial one for the first load of Tabs
    return new Promise(res => { this._initialResolve = res; });
  }

  get isSelected() {
    return this.tabs.isActive(this.item);
  }

  get isNotSelected() {
    return !this.tabs.isActive(this.item);
  }

}


@Directive({
  selector: 'template[pane-anchor]'
})
class TabPaneAnchor {
  constructor(@Parent() tab: Tab, elementRef: ElementRef) {
    tab.anchorElementRef(elementRef);
  }
}
