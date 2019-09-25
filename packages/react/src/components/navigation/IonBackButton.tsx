import { JSX as LocalJSX } from '@ionic/core';
import React from 'react';

import { NavContext } from '../../contexts/NavContext';
import { IonicReactProps } from '../IonicReactProps';
import { IonBackButtonInner } from '../inner-proxies';

type Props = LocalJSX.IonBackButton & IonicReactProps & {
  ref?: React.RefObject<HTMLIonBackButtonElement>;
};

export const IonBackButton = /*@__PURE__*/(() => class extends React.Component<Props> {
  context!: React.ContextType<typeof NavContext>;

  clickButton = (e: React.MouseEvent) => {
    const defaultHref = this.props.defaultHref;
    if (this.context.hasIonicRouter()) {
      e.stopPropagation();
      this.context.goBack(defaultHref);
    } else if (defaultHref !== undefined) {
      window.location.href = defaultHref;
    }
  }

  render() {
    return (
      <IonBackButtonInner onClick={this.clickButton} {...this.props}></IonBackButtonInner>
    );
  }

  static get displayName() {
    return 'IonBackButton';
  }

  static get contextType() {
    return NavContext;
  }
})();
