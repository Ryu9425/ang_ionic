import {
  modalController as modalCtrl,
  popoverController as popoverCtrl,
  alertController as alertCtrl,
  actionSheetController as actionSheetCtrl,
  loadingController as loadingCtrl,
  pickerController as pickerCtrl,
  toastController as toastCtrl,
} from '@ionic/core/components';

import { VueDelegate } from './framework-delegate';

import { defineCustomElement as defineIonModal } from '@ionic/core/components/ion-modal.js';
import { defineCustomElement as defineIonPopover } from '@ionic/core/components/ion-popover.js'
import { defineCustomElement as defineIonAlert } from '@ionic/core/components/ion-alert.js'
import { defineCustomElement as defineIonActionSheet } from '@ionic/core/components/ion-action-sheet.js'
import { defineCustomElement as defineIonLoading } from '@ionic/core/components/ion-loading.js'
import { defineCustomElement as defineIonPicker } from '@ionic/core/components/ion-picker.js'
import { defineCustomElement as defineIonToast } from '@ionic/core/components/ion-toast.js'

/**
 * Wrap the controllers export from @ionic/core
 * register the underlying Web Component and
 * (optionally) provide a framework delegate.
 */
const createController = (defineCustomElement: () => void, oldController: any, useDelegate = false) => {
  const delegate = useDelegate ? VueDelegate() : undefined;
  const oldCreate = oldController.create.bind(oldController);
  oldController.create = (options: any) => {
    defineCustomElement();

    return oldCreate({
      ...options,
      delegate
    })
  }

  return oldController;
}

const modalController = /*@__PURE__*/ createController(defineIonModal, modalCtrl, true);
const popoverController = /*@__PURE__*/ createController(defineIonPopover, popoverCtrl, true);
const alertController = /*@__PURE__*/ createController(defineIonAlert, alertCtrl);
const actionSheetController = /*@__PURE__*/ createController(defineIonActionSheet, actionSheetCtrl);
const loadingController = /*@__PURE__*/ createController(defineIonLoading, loadingCtrl);
const pickerController = /*@__PURE__*/ createController(defineIonPicker, pickerCtrl);
const toastController = /*@__PURE__*/ createController(defineIonToast, toastCtrl);

export {
  modalController,
  popoverController,
  alertController,
  actionSheetController,
  loadingController,
  pickerController,
  toastController
}
