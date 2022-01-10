import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { getScrollElement } from '../content/content.utils';

import { handleFooterFade } from './footer.utils';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-footer',
  styleUrls: {
    ios: 'footer.ios.scss',
    md: 'footer.md.scss'
  }
})
export class Footer implements ComponentInterface {
  private scrollEl?: HTMLElement;
  private contentScrollCallback: any;

  @Element() el!: HTMLIonFooterElement;

  /**
   * Describes the scroll effect that will be applied to the footer.
   * Only applies in iOS mode.
   */
  @Prop() collapse?: 'fade';

  /**
   * If `true`, the footer will be translucent.
   * Only applies when the mode is `"ios"` and the device supports
   * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
   *
   * Note: In order to scroll content behind the footer, the `fullscreen`
   * attribute needs to be set on the content.
   */
  @Prop() translucent = false;

  /**
   * The target element for the primary content container. This will
   * default to the `ion-content` selector.
   */
  @Prop() contentTarget = 'ion-content';

  /**
   * @internal
   *
   * The inner scroll target selector. This selector will be used for
   * the scroll container and queries inside of the `contentTarget` element.
   */
  @Prop() scrollTarget: string | null = null;

  componentDidLoad() {
    this.checkCollapsibleFooter();
  }

  componentDidUpdate() {
    this.checkCollapsibleFooter();
  }

  private checkCollapsibleFooter = () => {
    const mode = getIonMode(this);
    if (mode !== 'ios') { return; }

    const { collapse } = this;
    const hasFade = collapse === 'fade';

    this.destroyCollapsibleFooter();

    if (hasFade) {
      const pageEl = this.el.closest('ion-app,ion-page,.ion-page,page-inner');
      const contentEl = (pageEl) ? pageEl.querySelector<HTMLElement>(this.contentTarget) : null;

      this.setupFadeFooter(contentEl);
    }
  }

  private setupFadeFooter = async (contentEl: HTMLElement | null) => {
    if (!contentEl) { console.error('ion-footer requires a content to collapse. Make sure there is an ion-content.'); return; }

    const scrollEl = this.scrollEl = await getScrollElement(contentEl, this.scrollTarget);

    /**
     * Handle fading of toolbars on scroll
     */
    this.contentScrollCallback = () => { handleFooterFade(scrollEl, this.el); };
    scrollEl.addEventListener('scroll', this.contentScrollCallback);

    handleFooterFade(scrollEl, this.el);
  }

  private destroyCollapsibleFooter() {
    if (this.scrollEl && this.contentScrollCallback) {
      this.scrollEl.removeEventListener('scroll', this.contentScrollCallback);
      this.contentScrollCallback = undefined;
    }
  }

  render() {
    const { translucent, collapse } = this;
    const mode = getIonMode(this);
    return (
      <Host
        role="contentinfo"
        class={{
          [mode]: true,

          // Used internally for styling
          [`footer-${mode}`]: true,

          [`footer-translucent`]: translucent,
          [`footer-translucent-${mode}`]: translucent,

          [`footer-collapse-${collapse}`]: collapse !== undefined,
        }}
      >
        {mode === 'ios' && translucent &&
          <div class="footer-background"></div>
        }
        <slot></slot>
      </Host>
    );
  }
}
