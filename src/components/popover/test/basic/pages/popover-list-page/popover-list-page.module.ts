import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { PopoverListPage } from './popover-list-page';

@NgModule({
  declarations: [
    PopoverListPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverListPage)
  ],
  entryComponents: [
    PopoverListPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PopoverListPageModule {}
