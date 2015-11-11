
import {Config} from './config';


// iOS Mode Settings
Config.setModeConfig('ios', {
  activator: 'highlight',

  actionSheetEnter: 'action-sheet-slide-in',
  actionSheetLeave: 'action-sheet-slide-out',
  actionSheetCancelIcon: '',
  actionSheetDestructiveIcon: '',

  backButtonText: 'Back',
  backButtonIcon: 'ion-ios-arrow-back',

  iconMode: 'ios',

  modalEnter: 'modal-slide-in',
  modalLeave: 'modal-slide-out',

  pageTransition: 'ios',
  pageTransitionDelay: 16,

  popupPopIn: 'popup-pop-in',
  popupPopOut: 'popup-pop-out',

  tabbarPlacement: 'bottom',
});


// Material Design Mode Settings
Config.setModeConfig('md', {
  activator: 'ripple',

  actionSheetEnter: 'action-sheet-md-slide-in',
  actionSheetLeave: 'action-sheet-md-slide-out',
  actionSheetCancelIcon: 'ion-md-close',
  actionSheetDestructiveIcon: 'ion-md-trash',

  backButtonText: '',
  backButtonIcon: 'ion-md-arrow-back',

  iconMode: 'md',

  type: 'overlay',

  modalEnter: 'modal-md-slide-in',
  modalLeave: 'modal-md-slide-out',

  pageTransition: 'md',
  pageTransitionDelay: 80,

  popupPopIn: 'popup-md-pop-in',
  popupPopOut: 'popup-md-pop-out',

  tabbarHighlight: true,
  tabbarPlacement: 'top',

  tabSubPages: true,
});
