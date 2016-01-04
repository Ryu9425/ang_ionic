import {Page} from 'ionic/ionic';
import {forwardRef} from 'angular2/core';
import {AndroidAttribute} from '../../helpers';

@Page({
  templateUrl: 'cards/advanced-social/template.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class AdvancedSocialPage {
    constructor() {

    }
}