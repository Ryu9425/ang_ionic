import 'ionicons';

export { createAnimation } from './utils/animation/animation';
export { getTimeGivenProgression } from './utils/animation/cubic-bezier';
export { createGesture } from './utils/gesture';
export { createPressRecognizer } from './utils/gesture/recognizers/press';

export { isPlatform, Platforms, getPlatforms } from './utils/platform';

export * from './utils/config';
export * from './components/nav/constants';
export { menuController } from './utils/menu-controller';
export { alertController, actionSheetController, modalController, loadingController, pickerController, popoverController, toastController } from './utils/overlays';
