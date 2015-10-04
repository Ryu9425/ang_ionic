import {Component, View, ElementRef, NgZone, DynamicComponentLoader} from 'angular2/angular2';

import {ClickBlock} from '../../util/click-block';
import {ScrollTo} from '../../animations/scroll-to';
import * as dom from '../../util/dom';


/**
 * @name IonicApp
 * @description
 * Service exposing the Ionic app level API.
 *
 * @usage
 * ```js
 *  @App({
 *    templateUrl: '/app/app.html',
 *  })
 *  class MyApp {
 *
 *    constructor(app: IonicApp) {
 *      this.app = app;
 *    }
 *  }
 *  ```
 * Note: Ionic sets `ion-app` as the selector for the app. Setting a custom selector will override this and cause CSS problems.
 *
 */
export class IonicApp {

  /**
   * TODO
   */
  constructor() {
    this.overlays = [];
    this._disTime = 0;
    this._trnsTime = 0;

    // Our component registry map
    this.components = {};
  }

  /**
   * Sets the document title.
   * @param {string} val  Value to set the document title to.
   */
  title(val) {
    // TODO: User angular service
    document.title = val;
  }

  /**
   * Sets if the app is currently enabled or not, meaning if it's
   * available to accept new user commands. For example, this is set to `false`
   * while views transition, a modal slides up, an action-sheet
   * slides up, etc. After the transition completes it is set back to `true`.
   * @param {bool} isEnabled
   * @param {bool} fallback  When `isEnabled` is set to `false`, this argument
   * is used to set the maximum number of milliseconds that app will wait until
   * it will automatically enable the app again. It's basically a fallback incase
   * something goes wrong during a transition and the app wasn't re-enabled correctly.
   */
  setEnabled(isEnabled, fallback=700) {
    this._disTime = (isEnabled ? 0 : Date.now() + fallback);
    ClickBlock(!isEnabled, fallback + 100);
  }

  /**
   * Boolean if the app is actively enabled or not.
   * @return {bool}
   */
  isEnabled() {
    return (this._disTime < Date.now());
  }

  setTransitioning(isTransitioning, fallback=700) {
    this._trnsTime = (isTransitioning ? Date.now() + fallback : 0);
  }

  /**
   * Boolean if the app is actively transitioning or not.
   * @return {bool}
   */
  isTransitioning() {
    return (this._trnsTime > Date.now());
  }

  /**
   * Register a known component with a key, for easy lookups later.
   * @param {TODO} id  The id to use to register the component
   * @param {TODO} component  The component to register
   */
  register(id, component) {
    if (this.components[id] && this.components[id] !== component) {
      //console.error('Component id "' + id + '" already registered.');
    }
    this.components[id] = component;
  }

  /**
   * Unregister a known component with a key.
   * @param {TODO} id  The id to use to unregister
   */
  unregister(id) {
    delete this.components[id];
  }

  /**
   * Get a registered component with the given type (returns the first)
   * @param {Object} cls the type to search for
   * @return the matching component, or undefined if none was found
   */
  getRegisteredComponent(cls) {
    for(let component of this.components) {
      if(component instanceof cls) {
        return component;
      }
    }
  }

  /**
   * Get the component for the given key.
   * @param {TODO} key  TODO
   * @return {TODO} TODO
   */
  getComponent(id) {
    return this.components[id];
  }

  /**
   * Create and append the given component into the root
   * element of the app.
   *
   * @param {TODO} componentType the component to create and insert
   * @return {Promise} Promise that resolves with the ContainerRef created
   */
  appendOverlay(componentType: Type) {
    if (!this.overlayAnchor) {
      throw ('<ion-overlays></ion-overlays> must be added to your root component\'s template');
    }
    return this.overlayAnchor.append(componentType);
  }

}
