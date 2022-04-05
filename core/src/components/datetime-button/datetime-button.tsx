import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, State, h } from '@stencil/core';
import { componentOnReady } from '@utils/helpers';
import { printIonError } from '@utils/logging';

import type { Color, DatetimePresentation } from '../../interface';
import { getFormattedTime, getMonthAndYear, getMonthDayAndYear, getLocalizedDateTime } from '../datetime/utils/format';
import { is24Hour } from '../datetime/utils/helpers';
import { parseDate } from '../datetime/utils/parse';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-datetime-button',
  styleUrls: {
    ios: 'datetime-button.ios.scss',
    md: 'datetime-button.md.scss',
  },
  shadow: true,
})
export class DatetimeButton implements ComponentInterface {
  private datetimeEl: HTMLIonDatetimeElement | null = null;

  @State() datetimePresentation?: DatetimePresentation;
  @State() dateText?: string;
  @State() timeText?: string;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * If `true`, the user cannot interact with the button.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * The ID of the `ion-datetime` instance
   * associated with the datetime button.
   */
  @Prop() datetime?: string;

  async componentWillLoad() {
    const { datetime } = this;
    if (!datetime) {
      printIonError(
        'An ID associated with an ion-datetime instance is required for ion-datetime-button to function properly.'
      );
      return;
    }

    const datetimeEl = (this.datetimeEl = document.getElementById(datetime) as HTMLIonDatetimeElement | null);
    if (!datetimeEl) {
      printIonError(`No ion-datetime instance found for ID '${datetime}'.`);
      return;
    }

    componentOnReady(datetimeEl, () => {
      this.datetimePresentation = datetimeEl.presentation;

      this.setDateTimeText();
      datetimeEl.addEventListener('ionChange', this.setDateTimeText);
    });
  }

  private setDateTimeText = () => {
    const { datetimeEl, datetimePresentation } = this;

    if (!datetimeEl) {
      return;
    }

    const { value, locale, hourCycle } = datetimeEl;
    const parsedDatetime = parseDate(value);
    const use24Hour = is24Hour(locale, hourCycle);

    switch (datetimePresentation) {
      case 'date-time':
      case 'time-date':
        this.dateText = getMonthDayAndYear(locale, parsedDatetime);
        this.timeText = getFormattedTime(parsedDatetime, use24Hour);
        break;
      case 'date':
        this.dateText = getMonthDayAndYear(locale, parsedDatetime);
        break;
      case 'time':
        this.timeText = getFormattedTime(parsedDatetime, use24Hour);
        break;
      case 'month-year':
        this.dateText = getMonthAndYear(locale, parsedDatetime);
        break;
      case 'month':
        this.dateText = getLocalizedDateTime(locale, parsedDatetime, { month: 'long' });
        break;
      case 'year':
        this.dateText = getLocalizedDateTime(locale, parsedDatetime, { year: 'numeric' });
        break;
      default:
        break;
    }
  };

  private handleDateClick = () => {
    const { datetimeEl, datetimePresentation } = this;

    if (!datetimeEl) {
      return;
    }

    /**
     * When clicking the date button,
     * we need to make sure that only a date
     * picker is displayed. For presentation styles
     * that display content other than a date picker,
     * we need to update the presentation style.
     */
    switch (datetimePresentation) {
      case 'date-time':
      case 'time-date':
        datetimeEl.presentation = 'date';
        break;
      default:
        break;
    }
  };

  private handleTimeClick = () => {
    const { datetimeEl, datetimePresentation } = this;

    if (!datetimeEl) {
      return;
    }

    /**
     * When clicking the time button,
     * we need to make sure that only a time
     * picker is displayed. For presentation styles
     * that display content other than a time picker,
     * we need to update the presentation style.
     */
    switch(datetimePresentation) {
      case 'date-time':
      case 'time-date':
        datetimeEl.presentation = 'time';
        break;
      default:
        break;
    }
  };

  render() {
    const { dateText, timeText, datetimePresentation } = this;
    const showDateTarget = !datetimePresentation || ['date-time', 'time-date', 'date', 'month', 'year', 'month-year'].includes(datetimePresentation);
    const showTimeTarget = !datetimePresentation || ['date-time', 'time-date', 'time'].includes(datetimePresentation);

    return (
      <Host>
        { showDateTarget && <div class="date-target-container" aria-haspopup="dialog" onClick={() => this.handleDateClick()}>
          <slot name="date-target">
            <button>{dateText}</button>
          </slot>
        </div> }

        { showTimeTarget && <div class="time-target-container" aria-haspopup="dialog" onClick={() => this.handleTimeClick()}>
          <slot name="time-target">
            <button>{timeText}</button>
          </slot>
        </div> }
      </Host>
    );
  }
}
