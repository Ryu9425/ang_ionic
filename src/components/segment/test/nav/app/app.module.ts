import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../../..';

import { AppComponent } from './app.component';
import { FirstPageModule } from '../pages/first-page/first-page.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent, {}),
    FirstPageModule
  ],
  bootstrap: [IonicApp],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
