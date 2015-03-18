import {Component, Template} from 'angular2/angular2';
import {Ion} from '../ion';

@Component({
  selector: 'ion-modal'
})
@Template({
  inline: `
    <div class="modal-backdrop">
      <div class="modal-backdrop-bg"></div>
      <div class="modal-wrapper"><content></content></div>
    </div>`
})
export class Modal extends Ion {
  constructor() {
  }
  show() {
  }
  hide() {
  }
}
