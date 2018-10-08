import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';

import { Animation, AnimationBuilder, ComponentProps, ComponentRef, Config, FrameworkDelegate, Mode, OverlayEventDetail, OverlayInterface } from '../../interface';
import { attachComponent, detachComponent } from '../../utils/framework-delegate';
import { BACKDROP, dismiss, eventMethod, present } from '../../utils/overlays';
import { getClassMap } from '../../utils/theme';
import { deepReady } from '../../utils/transition';

import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';

@Component({
  tag: 'ion-popover',
  styleUrls: {
    ios: 'popover.ios.scss',
    md: 'popover.md.scss'
  },
  scoped: true
})
export class Popover implements ComponentInterface, OverlayInterface {

  private usersElement?: HTMLElement;

  presented = false;
  animation?: Animation;

  @Element() el!: HTMLElement;

  @Prop({ connect: 'ion-animation-controller' }) animationCtrl!: HTMLIonAnimationControllerElement;
  @Prop({ context: 'config' }) config!: Config;
  @Prop() delegate?: FrameworkDelegate;
  @Prop() overlayIndex!: number;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * Animation to use when the popover is presented.
   */
  @Prop() enterAnimation?: AnimationBuilder;

  /**
   * Animation to use when the popover is dismissed.
   */
  @Prop() leaveAnimation?: AnimationBuilder;

  /**
   * The component to display inside of the popover.
   */
  @Prop() component!: ComponentRef;

  /**
   * The data to pass to the popover component.
   */
  @Prop() componentProps?: ComponentProps;

  /**
   * If true, the keyboard will be automatically dismissed when the overlay is presented.
   */
  @Prop() keyboardClose = true;

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   */
  @Prop() cssClass?: string | string[];

  /**
   * If true, the popover will be dismissed when the backdrop is clicked. Defaults to `true`.
   */
  @Prop() backdropDismiss = true;

  /**
   * The event to pass to the popover animation.
   */
  @Prop() event: any;

  /**
   * If true, a backdrop will be displayed behind the popover. Defaults to `true`.
   */
  @Prop() showBackdrop = true;

  /**
   * If true, the popover will be translucent. Defaults to `false`.
   */
  @Prop() translucent = false;

  /**
   * If true, the popover will animate. Defaults to `true`.
   */
  @Prop() animated = true;

  /**
   * Emitted after the popover has loaded.
   */
  @Event() ionPopoverDidLoad!: EventEmitter<void>;

  /**
   * Emitted after the popover has unloaded.
   */
  @Event() ionPopoverDidUnload!: EventEmitter<void>;

  /**
   * Emitted after the popover has presented.
   */
  @Event({ eventName: 'ionPopoverDidPresent' }) didPresent!: EventEmitter<void>;

  /**
   * Emitted before the popover has presented.
   */
  @Event({ eventName: 'ionPopoverWillPresent' }) willPresent!: EventEmitter<void>;

  /**
   * Emitted before the popover has dismissed.
   */
  @Event({ eventName: 'ionPopoverWillDismiss' }) willDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the popover has dismissed.
   */
  @Event({ eventName: 'ionPopoverDidDismiss' }) didDismiss!: EventEmitter<OverlayEventDetail>;

  componentDidLoad() {
    this.ionPopoverDidLoad.emit();
  }

  componentDidUnload() {
    this.ionPopoverDidUnload.emit();
  }

  @Listen('ionDismiss')
  protected onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  @Listen('ionBackdropTap')
  protected onBackdropTap() {
    this.dismiss(undefined, BACKDROP);
  }

  @Listen('ionPopoverDidPresent')
  @Listen('ionPopoverWillPresent')
  @Listen('ionPopoverWillDismiss')
  @Listen('ionPopoverDidDismiss')
  protected lifecycle(modalEvent: CustomEvent) {
    const el = this.usersElement;
    const name = LIFECYCLE_MAP[modalEvent.type];
    if (el && name) {
      const event = new CustomEvent(name, {
        bubbles: false,
        cancelable: false,
        detail: modalEvent.detail
      });
      el.dispatchEvent(event);
    }
  }

  /**
   * Present the popover overlay after it has been created.
   */
  @Method()
  async present(): Promise<void> {
    if (this.presented) {
      return;
    }
    const container = this.el.querySelector('.popover-content');
    if (!container) {
      throw new Error('container is undefined');
    }
    const data = {
      ...this.componentProps,
      popover: this.el
    };
    this.usersElement = await attachComponent(this.delegate, container, this.component, ['popover-viewport', (this.el as any)['s-sc']], data);
    await deepReady(this.usersElement);
    return present(this, 'popoverEnter', iosEnterAnimation, mdEnterAnimation, this.event);
  }

  /**
   * Dismiss the popover overlay after it has been presented.
   */
  @Method()
  async dismiss(data?: any, role?: string): Promise<boolean> {
    const shouldDismiss = await dismiss(this, data, role, 'popoverLeave', iosLeaveAnimation, mdLeaveAnimation, this.event);
    if (shouldDismiss) {
      await detachComponent(this.delegate, this.usersElement);
    }
    return shouldDismiss;
  }

  /**
   * Returns a promise that resolves when the popover did dismiss.
   */
  @Method()
  onDidDismiss(): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionPopoverDidDismiss');
  }

  /**
   * Returns a promise that resolves when the popover will dismiss.
   */
  @Method()
  onWillDismiss(): Promise<OverlayEventDetail> {
    return eventMethod(this.el, 'ionPopoverWillDismiss');
  }

  hostData() {

    return {
      style: {
        zIndex: 20000 + this.overlayIndex,
      },
      'no-router': true,
      class: {
        'popover-translucent': this.translucent,

        ...getClassMap(this.cssClass),
      }
    };
  }

  render() {
    return [
      <ion-backdrop tappable={this.backdropDismiss} visible={this.showBackdrop}/>,
      <div class="popover-wrapper">
        <div class="popover-arrow"></div>
        <div class="popover-content"></div>
      </div>
    ];
  }
}

const LIFECYCLE_MAP: any = {
  'ionPopoverDidPresent': 'ionViewDidEnter',
  'ionPopoverWillPresent': 'ionViewWillEnter',
  'ionPopoverWillDismiss': 'ionViewWillLeave',
  'ionPopoverDidDismiss': 'ionViewDidLeave',
};
