import { h, inject, defineComponent } from 'vue';
import { defineCustomElement as defineIonBackButton } from '@ionic/core/components/ion-back-button.js';
import { defineCustomElement as defineIonIcon } from 'ionicons/components/ion-icon.js';

export const IonBackButton = /*@__PURE__*/ defineComponent((_, { attrs, slots }) => {
  defineIonBackButton();
  defineIonIcon();

  const ionRouter: any = inject('navManager');

  const onClick = () => {
    const defaultHref = attrs['default-href'] || attrs['defaultHref'];
    const routerAnimation = attrs['router-animation'] || attrs['routerAnimation'];

    ionRouter.handleNavigateBack(defaultHref, routerAnimation);
  }

  return () => {
    return h(
      'ion-back-button',
      {
        onClick,
        ...attrs
      },
      slots.default && slots.default()
    )
  }
});
