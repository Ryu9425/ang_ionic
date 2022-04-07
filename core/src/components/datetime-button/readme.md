# ion-datetime-button

Datetime Button is component that is used with [Datetime](./datetime). It renders buttons with the localized selected date and time. Clicking the date button will cause the paired datetime to render a date selection interface. Clicking the time button will cause the paired datetime to render a time selection. When paired with [Popover](./popover) it can be used to easily show a datetime in an overlay.

## Accessibility

### Keyboard Navigation

`ion-datetime-button` has keyboard support for navigating between the focusable buttons inside of the component. The following table details what each key does:

| Key                | Function                                                     |
| ------------------ | ------------------------------------------------------------ |
| `Tab`              | Moves focus to the next focusable button.                    |
| `Shift` + `Tab`    | Moves focus to the previous focusable button.                |
| `Space` or `Enter` | Clicks the focusable button.                                 |

### ARIA

Each button rendered inside of `ion-datetime-button` has `aria-expanded` set. This is used to indicate to assistive technologies that interacting with the button can be used to expand or collapse the datetime.

Note that if developers use their own buttons in the `date-button` or `time-button` slots, they will need to handle the `aria-expanded` logic themselves.

<!-- Auto Generated Below -->


## Usage

### Javascript

```html
<!-- Basic -->
<ion-datetime-button datetime="basic-datetime"></ion-datetime-button>
<ion-datetime id="basic-datetime"></ion-datetime>

<!-- Modal -->
<ion-datetime-button id="modal-datetime-button" datetime="modal-datetime"></ion-datetime-button>

<ion-modal trigger="modal-datetime-button">
  <ion-content>
    <ion-datetime id="modal-datetime"></ion-datetime>
  </ion-content>
</ion-modal>

<!-- Popover -->
<ion-datetime-button id="popover-datetime-button" datetime="popover-datetime"></ion-datetime-button>

<ion-popover trigger="popover-datetime-button">
  <ion-content>
    <ion-datetime id="popover-datetime"></ion-datetime>
  </ion-content>
</ion-popover>

<!-- Accordion -->
<ion-accordion-group>
  <ion-accordion value="datetime">
    <ion-item slot="header">
      <ion-label>Select Date</ion-label>
      <ion-datetime-button id="accordion-datetime-button" slot="end" datetime="accordion-datetime"></ion-datetime-button>
    </ion-item>

    <ion-datetime slot="content" id="accordion-datetime"></ion-datetime>
  </ion-accordion>
</ion-accordion-group>

<script>
  const datetimeButton = document.querySelector('accordion-datetime-button');
  const accordionGroup = document.querySelector('ion-accordion-group');
  const accordion = document.querySelector('ion-accordion');

  datetimeButton.onclick = () => {
    accordionGroup.value = accordion.value;
    
    /**
     * Prevent the click event
     * from bubbling up and causing
     * the accordion to close
     * if opened.
     */
    ev.stopPropagation();
  }
</script>
```



## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                            | Type                  | Default     |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `color`    | `color`    | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined` | `'primary'` |
| `datetime` | `datetime` | The ID of the `ion-datetime` instance associated with the datetime button.                                                                                                                                                                                             | `string \| undefined` | `undefined` |
| `disabled` | `disabled` | If `true`, the user cannot interact with the button.                                                                                                                                                                                                                   | `boolean`             | `false`     |
| `mode`     | `mode`     | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`       | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
