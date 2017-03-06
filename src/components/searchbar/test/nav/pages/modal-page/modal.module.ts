import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { ModalPage } from './modal';

@NgModule({
  declarations: [
    ModalPage,
  ],
  imports: [
    DeepLinkModule.forChild(ModalPage)
  ],
  entryComponents: [
    ModalPage,
  ]
})
export class ModalPageModule {}
