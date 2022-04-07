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

### Angular

```html
<!-- Basic -->
<ion-datetime-button datetime="basic-datetime"></ion-datetime-button>
<ion-datetime id="basic-datetime"></ion-datetime>

<!-- Modal -->
<ion-datetime-button id="modal-datetime-button" datetime="modal-datetime"></ion-datetime-button>

<ion-modal trigger="modal-datetime-button">
  <ng-template>
    <ion-content>
      <ion-datetime id="modal-datetime"></ion-datetime>
    </ion-content>
  </ng-template>
</ion-modal>

<!-- Popover -->
<ion-datetime-button id="popover-datetime-button" datetime="popover-datetime"></ion-datetime-button>

<ion-popover trigger="popover-datetime-button">
  <ng-template>
    <ion-content>
      <ion-datetime id="popover-datetime"></ion-datetime>
    </ion-content>
  </ng-template>
</ion-popover>

<!-- Accordion -->
<ion-accordion-group #accordionGroup>
  <ion-accordion value="datetime" #accordion>
    <ion-item slot="header">
      <ion-label>Select Date</ion-label>
      <ion-datetime-button id="accordion-datetime-button" slot="end" datetime="accordion-datetime" (click)="handleAccordion(#accordionGroup, #accordion, $event)"></ion-datetime-button>
    </ion-item>

    <ion-datetime slot="content" id="accordion-datetime"></ion-datetime>
  </ion-accordion>
</ion-accordion-group>
```

**component.ts**
```typescript
import { Component } from '@angular/core';

@Component({…})
export class MyComponent {
  constructor() {}
  
  handleAccordion(accordionGroup: HTMLElement, accordion: HTMLElement, ev: Event) {
    accordionGroup.value = accordion.value;
    
    /**
     * Prevent the click event
     * from bubbling up and causing
     * the accordion to close
     * if opened.
     */
    ev.stopPropagation();
  }
}
```


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


### React

```tsx
import React, { useRef } from 'react';

import { IonAccordionGroup, IonAccordion, IonContent, IonDatetime, IonDatetimeButton, IonItem, IonLabel, IonModal, IonPopover, IonPage } from '@ionic/react';

export const DatetimeButtonExample: React.FC = () => {
  const accordionGroupRef = useRef(null);
  const accordionRef = useRef(null);
  
  const handleAccordion = (ev: Event) => {
    if (accordionGroupRef.current && accordionRef.current) {
      accordionGroupRef.current.value = accordionRef.current.value;
      
      /**
       * Prevent the click event
       * from bubbling up and causing
       * the accordion to close
       * if opened.
       */
      ev.stopPropagation();
    }
  }
  
  return (
    <IonPage>
      <IonContent>
        {/*-- Basic --*/}
        <IonDatetimeButton datetime="basic-datetime"></IonDatetimeButton>
        <IonDatetime id="basic-datetime"></IonDatetime>
      
        {/*-- Modal --*/}
        <IonDatetimeButton id="modal-datetime-button" datetime="modal-datetime"></IonDatetimeButton>
        
        <IonModal trigger="modal-datetime-button">
          <IonContent>
            <IonDatetime id="modal-datetime"></IonDatetime>
          </IonContent>
        </IonModal>
      
        {/*-- Popover --*/}
        <IonDatetimeButton id="popover-datetime-button" datetime="popover-datetime"></IonDatetimeButton>
        
        <IonPopover trigger="popover-datetime-button">
          <IonContent>
            <IonDatetime id="popover-datetime"></IonDatetime>
          </IonContent>
        </IonPopover>
      
        {/*-- Accordion --*/}
        <IonAccordionGroup ref={accordionGroupRef}>
          <IonAccordion value="datetime" ref={accordionRef}>
            <IonItem slot="header">
              <IonLabel>Select Date</IonLabel>
              <IonDatetimeButton
                id="accordIonDatetimeButton" 
                slot="end" 
                datetime="accordIonDatetime"
                onClick={handleAccordion}
              ></IonDatetimeButton>
            </IonItem>
        
            <IonDatetime slot="content" id="accordIonDatetime"></IonDatetime>
          </IonAccordion>
        </IonAccordionGroup>
      </IonContent>
    </IonPage>
  )
);
```


### Stencil

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'datetime-button-example',
  styleUrl: 'datetime-button-example.css'
})
export const DatetimeButtonExample {
  private accordionGroupRef?: HTMLIonAccordionGroupElement;
  private accordionRef?: HTMLIonAccordionElement;

  private handleAccordion = (ev: Event) => {
    const { accordionGroupRef, accordionRef } = this.
    
    if (accordionGroupRef && accordionRef) {
      accordionGroupRef.value = accordionRef.value;
      
      /**
       * Prevent the click event
       * from bubbling up and causing
       * the accordion to close
       * if opened.
       */
      ev.stopPropagation();
    }
  }
  
  render() {
    return (
      <ion-page>
        <ion-content>
          {/*-- Basic --*/}
          <ion-datetime-button datetime="basic-datetime"></ion-datetime-button>
          <ion-datetime id="basic-datetime"></ion-datetime>
        
          {/*-- Modal --*/}
          <ion-datetime-button id="modal-datetime-button" datetime="modal-datetime"></ion-datetime-button>
          
          <ion-modal trigger="modal-datetime-button">
            <ion-content>
              <ion-datetime id="modal-datetime"></ion-datetime>
            </ion-content>
          </ion-modal>
        
          {/*-- Popover --*/}
          <ion-datetime-button id="popover-datetime-button" datetime="popover-datetime"></ion-datetime-button>
          
          <ion-popover trigger="popover-datetime-button">
            <ion-content>
              <ion-datetime id="popover-datetime"></ion-datetime>
            </ion-content>
          </ion-popover>
        
          {/*-- Accordion --*/}
          <ion-accordion-group ref={el => this.accordionGroupRef}>
            <ion-accordion value="datetime" ref={el => accordionRef}>
              <ion-item slot="header">
                <ion-label>Select Date</ion-label>
                <ion-datetime-button
                  id="accordion-datetime-button" 
                  slot="end" 
                  datetime="accordion-datetime"
                  onClick={(ev: Event) => handleAccordion()}
                ></ion-datetime-button>
              </ion-item>
          
              <ion-datetime slot="content" id="accordion-datetime"></ion-datetime>
            </ion-accordion>
          </ion-accordion-group>
        </ion-content>
      </ion-page>
    );
  }
);
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
