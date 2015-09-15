import * as Rx from 'rx';

import * as util from 'ionic/util';
import {NativePlugin} from '../plugin';

/**
 * Manage the appearance of the native status bar.
 */
@NativePlugin({
  name: 'StatusBar',
  platforms: {
    cordova: 'cordova-plugin-statusbar'
  }
})
export class StatusBar {
  static DEFAULT = 0
  static LIGHT_CONTENT = 1
  static BLACK_TRANSLUCENT = 2
  static BLACK_OPAQUE = 3

  /**
   * Show the StatusBar
   */
  static show() {
    this.ifPlugin(window.StatusBar, () => {
      window.StatusBar.show();
    })
  }
  
  /**
   * Hide the StatusBar
   */
  static hide() {
    this.ifPlugin(window.StatusBar, () => {
      window.StatusBar.hide();
    })
  }

  /**
   * Hide the StatusBar
   *
   * Options:
   *
   * StatusBar.DEFAULT
   * StatusBar.LIGHT_CONTENT
   * StatusBar.BLACK_TRANSLUCENT
   * StatusBar.BLACK_OPAQUE
   *
   * @param style the style from above
   */
  static setStyle(style) {
    this.ifPlugin(window.StatusBar, () => {
      switch(style) {
        case StatusBar.DEFAULT:
          window.StatusBar.styleDefault();
          break;
        case StatusBar.LIGHT_CONTENT:
          window.StatusBar.styleLightContent();
          break;
        case StatusBar.BLACK_TRANSLUCENT:
          window.StatusBar.styleBlackTranslucent();
          break;
        case StatusBar.BLACK_OPAQUE:
          window.StatusBar.styleBlackOpaque();
          break;
      }
    })
  }

  /**
   * Set the status bar to a specific hex color (CSS shorthand supported!).
   *
   * iOS note: you must call StatusBar.setOverlay(false) to enable color changing.
   *
   * @param hex the hex value of the color.
   */
  static setHexColor(hex) {
    this.ifPlugin(window.StatusBar, () => {
      window.StatusBar.backgroundColorByHexName(hex);
    });
  }

  /**
   * Set the status bar to a specific named color. Valid options:
   * black, darkGray, lightGray, white, gray, red, green, blue, cyan, yellow, magenta, orange, purple, brown.
   *
   * iOS note: you must call StatusBar.setOverlay(false) to enable color changing.
   *
   * @param name the name of the color (from above)
   */
  static setNamedColor(name) {
    this.ifPlugin(window.StatusBar, () => {
      window.StatusBar.backgroundColorByName(name);
    });
  }

  /**
   * Set whether the status bar overlays the main app view. The default
   * is true.
   *
   * @param doesOverlay whether the status bar overlays the main app view.
   */
  static setOverlays(doesOverlay) {
    this.ifPlugin(window.StatusBar, () => {
      window.StatusBar.overlaysWebView(doesOverlay);
    });
  }
}
