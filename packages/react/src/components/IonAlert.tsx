import { AlertOptions, alertController } from '@ionic/core/components';
import { defineCustomElement as defineIonAlert } from '@ionic/core/components/ion-alert.js';

import { createControllerComponent } from './createControllerComponent';

export const IonAlert = /*@__PURE__*/ createControllerComponent<AlertOptions, HTMLIonAlertElement>(
  'ion-alert',
  alertController,
  defineIonAlert
);
