import {NgElement} from 'angular2/angular2'
Object.defineProperties(NgElement.prototype, {
  domElement: {
    get: function() {
      return this._view.render.delegate.boundElements[this._boundElementIndex];
    }
  }
});

export * from 'ionic/components'
export * from 'ionic/platform/platform'
export * from 'ionic/routing/router'
export * from 'ionic/webview/webview'
export * from 'ionic/webview/cordova/cordova'
export * from 'ionic/webview/node-webkit/node-webkit'
export * from 'ionic/util/focus'
export * from 'ionic/collide/animation'
