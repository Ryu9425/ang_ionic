import {View, ElementRef, onInit} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicComponent} from '../../config/annotations';
import {Gesture} from '../../gestures/gesture';
import {CSS} from '../../util/dom';
import {Animation} from '../../animations/animation';

import * as util from 'ionic/util';

/**
 * ion-scroll is a non-flexboxed scroll area that can
 * scroll horizontally or vertically.
 */
@IonicComponent({
  selector: 'ion-scroll',
  properties: [
    'scrollX', 'scrollY', 'zoom'
  ],
  host: {
    '[class.scroll-x]': 'scrollX',
    '[class.scroll-y]': 'scrollY'
  },
})
@View({
  template: '<scroll-content><ng-content></ng-content></scroll-content>'
})
export class Scroll extends Ion {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   * @param {IonicConfig} config  TODO
   */
  constructor(elementRef: ElementRef, ionicConfig: IonicConfig) {
    super(elementRef, ionicConfig);

    this.zoomAmount = 1;
  }

  onInit() {
    this.scrollElement = this.getNativeElement().children[0];

    if(util.isTrueProperty(this.zoom)) {
      console.log('Zoom?', this.zoom);

      this.initZoomScrolling();
    }
  }

  initZoomScrolling() {
    this.zoomElement = this.scrollElement.children[0];

    this.zoomElement && this.zoomElement.classList.add('ion-scroll-zoom');

    this.scrollElement.addEventListener('scroll', (e) => {
      console.log("Scrolling", e);
    });

    this.zoomGesture = new Gesture(this.scrollElement);
    this.zoomGesture.listen();

    this.zoomGesture.on('pinch', (e) => {
      console.log('PINCH', e);
    });

    this.zoomGesture.on('doubletap', (e) => {
      this.zoomAnimation = new Animation(this.zoomElement)
        .duration(200)
        .easing('ease-in');

      if(this.zoomAmount > 1) {
        this.zoomAnimation.from('scale', this.zoomAmount);
        this.zoomAnimation.to('scale', 1);
        this.zoomAnimation.play();
        this.zoomAmount = 1;
      } else {
        this.zoomAnimation.from('scale', this.zoomAmount);
        this.zoomAnimation.to('scale', 3);
        this.zoomAnimation.play();
        this.zoomAmount = 3;
      }
      //this.zoomElement.style[CSS.transform] = 'scale(3)';
    });
  }

  /**
   * Add a scroll event handler to the scroll element if it exists.
   * @param {Function} handler  The scroll handler to add to the scroll element.
   * @returns {?Function} a function to remove the specified handler, otherwise
   * undefined if the scroll element doesn't exist.
   */
  addScrollEventListener(handler) {
    if(!this.scrollElement) { return; }

    this.scrollElement.addEventListener('scroll', handler);

    return () => {
      this.scrollElement.removeEventListener('scroll', handler);
    }
  }
}
