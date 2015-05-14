import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';
import {bind} from 'angular2/di';

import * as util from 'ionic/util';
import {NavController} from './nav-controller';


export class NavItem {

  constructor(nav, ComponentClass, params = {}) {
    this.nav = nav;
    this.Class = ComponentClass;
    this.params = params;
    this.id = util.nextUid();
    this.headers = [];
    this.disposals = [];
  }

  setup() {
    if (!this.created) {
      return this.create();
    }
    return Promise.resolve();
  }

  create() {
    this.created = true;

    let resolve;
    let promise = new Promise((res) => { resolve = res; });

    let injector = this.nav.injector.resolveAndCreateChild([
      bind(NavController).toValue(this.nav.navCtrl),
      bind(NavParams).toValue(new NavParams(this.params)),
      bind(NavItem).toValue(this)
    ]);

    this.nav.loader.loadNextToExistingLocation(this.Class, this.nav.contentElementRef, injector).then((componentRef) => {

      // content
      this.component = componentRef;
      this.domElement = componentRef.location.domElement;
      this.domElement.classList.add('nav-item');
      this.domElement.setAttribute('data-nav-item-id', this.id);

      if (componentRef && componentRef._dispose) {
        this.disposals.push(componentRef._dispose);
      }


      // TODO: talk to misko about correct way to set context
      let context = {
        boundElementIndex: 0,
        parentView: {
          _view: componentRef.location.parentView._view.componentChildViews[0]
        }
      };

      for (let i = 0; i < this.headers.length; i++) {
        this.createHeader(this.headers[i], context, injector);
      }

      resolve();
    });

    return promise;
  }

  createHeader(toolbarProtoView, context, injector) {
    let headerContainer = this.nav.headerContainerRef;

    if (!headerContainer) return;

    let atIndex = -1;

    let headerViewRef = headerContainer.create(toolbarProtoView, atIndex, context, injector);

    if (headerViewRef) {
      this.disposals.push(() => {
        var index = headerContainer.indexOf(headerViewRef);
        headerContainer.remove(index);
        headerViewRef = null;
      });
    }
  }

  addHeader(toolbarProtoView) {
    this.headers.push(toolbarProtoView);
  }

  destroy() {
    for (let i = 0; i < this.disposals.length; i++) {
      this.disposals[i]();
    }

    // just to help prevent any possible memory leaks
    for (let prop in this) {
      this[prop] = null;
    }
  }

}

export class NavParams {
  constructor(params) {
    util.extend(this, params);
  }
}
