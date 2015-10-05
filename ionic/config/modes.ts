
import {IonicConfig} from './config';


// iOS Mode Settings
IonicConfig.setModeConfig('ios', {

  actionSheetEnter: 'action-sheet-slide-in',
  actionSheetLeave: 'action-sheet-slide-out',
  actionSheetCancelIcon: '',
  actionSheetDestructiveIcon: '',

  backButtonText: 'Back',
  backButtonIcon: 'ion-ios-arrow-back',

  iconMode: 'ios',

  modalEnter: 'modal-slide-in',
  modalLeave: 'modal-slide-out',

  tabBarPlacement: 'bottom',
  viewTransition: 'ios',

  popupPopIn: 'popup-pop-in',
  popupPopOut: 'popup-pop-out',
});


// Material Design Mode Settings
IonicConfig.setModeConfig('md', {

  actionSheetEnter: 'action-sheet-md-slide-in',
  actionSheetLeave: 'action-sheet-md-slide-out',
  actionSheetCancelIcon: 'ion-md-close',
  actionSheetDestructiveIcon: 'ion-md-trash',

  backButtonText: '',
  backButtonIcon: 'ion-md-arrow-back',

  iconMode: 'md',

  modalEnter: 'modal-md-slide-in',
  modalLeave: 'modal-md-slide-out',

  tabBarPlacement: 'top',
  viewTransition: 'md',

  popupPopIn: 'popup-md-pop-in',
  popupPopOut: 'popup-md-pop-out',

  type: 'overlay',
  mdRipple: true,
});
