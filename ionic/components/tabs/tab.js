import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {Injector} from 'angular2/di';

import {Tabs} from './tabs';
import {Content} from '../content/content';
import * as util from 'ionic/util';
import {IonicComponent} from 'ionic/config/component';
import {NavBase} from '../nav/nav-base';


@Directive({
  selector: 'ion-tab',
  properties: [
    'initial',
    'tabTitle',
    'tabIcon'
  ],
  hostProperties: {
    'contentId': 'attr.id',
    'labeledBy': 'attr.aria-labelledby'
  },
  hostAttributes: {
    'role': 'tabpanel'
  }
})
export class Tab {
  constructor(
    @Parent() tabs: Tabs,
    elementRef: ElementRef,
    loader: DynamicComponentLoader,
    injector: Injector
  ) {
    this.nav = new NavBase(loader, injector);
    this.domElement = elementRef.domElement;

    this.config = Tab.config.invoke(this);

    this.tabId = util.nextUid();
    this.contentId = 'tab-content-' + this.tabId;
    this.labeledBy = 'tab-item-' + this.tabId;

    tabs.addTab(this);
  }

  setRef(ref) {
    this.nav.contentElementRef = ref;
  }

  set initial(value) {
    this.nav.initial = value;
  }

  setSelected(isSelected) {
    this.isSelected = isSelected;
  }

}

new IonicComponent(Tab, {});


@Directive({
  selector: '[content-anchor]'
})
class ContentAnchor {
  constructor(@Parent() tab: Tab, elementRef: ElementRef) {
    tab.setRef(elementRef);
  }
}
