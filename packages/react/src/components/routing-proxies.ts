import type { JSX } from '@ionic/core/components';
import { defineCustomElement as defineIonButton } from '@ionic/core/components/ion-button.js';
import { defineCustomElement as defineIonCard } from '@ionic/core/components/ion-card.js';
import { defineCustomElement as defineIonFabButton } from '@ionic/core/components/ion-fab-button.js';
import { defineCustomElement as defineIonItemOption } from '@ionic/core/components/ion-item-option.js';
import { defineCustomElement as defineIonItem } from '@ionic/core/components/ion-item.js';
import { defineCustomElement as defineIonRouterLink } from '@ionic/core/components/ion-router-link.js';

import { createRoutingComponent } from './createRoutingComponent';
import { HrefProps } from './hrefprops';

export const IonRouterLink = /*@__PURE__*/ createRoutingComponent<
  HrefProps<JSX.IonRouterLink>,
  HTMLIonRouterLinkElement
>('ion-router-link', defineIonRouterLink);

export const IonButton = /*@__PURE__*/ createRoutingComponent<
  HrefProps<JSX.IonButton>,
  HTMLIonButtonElement
>('ion-button', defineIonButton);

export const IonCard = /*@__PURE__*/ createRoutingComponent<
  HrefProps<JSX.IonCard>,
  HTMLIonCardElement
>('ion-card', defineIonCard);

export const IonFabButton = /*@__PURE__*/ createRoutingComponent<
  HrefProps<JSX.IonFabButton>,
  HTMLIonFabButtonElement
>('ion-fab-button', defineIonFabButton);

export const IonItem = /*@__PURE__*/ createRoutingComponent<
  HrefProps<JSX.IonItem>,
  HTMLIonItemElement
>('ion-item', defineIonItem);

export const IonItemOption = /*@__PURE__*/ createRoutingComponent<
  HrefProps<JSX.IonItemOption>,
  HTMLIonItemOptionElement
>('ion-item-option', defineIonItemOption);
