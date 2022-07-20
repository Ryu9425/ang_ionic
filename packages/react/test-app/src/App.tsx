import React from 'react';
import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Main from './pages/Main';
import OverlayHooks from './pages/overlay-hooks/OverlayHooks';
import OverlayComponents from './pages/overlay-components/OverlayComponents';
import Tabs from './pages/Tabs';
import NavComponent from './pages/navigation/NavComponent';
import IonModalConditionalSibling from './pages/issues/IonModalConditionalSibling';
import IonModalConditional from './pages/issues/IonModalConditional';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/" component={Main} />
        <Route path="/overlay-hooks" component={OverlayHooks} />
        <Route path="/overlay-components" component={OverlayComponents} />
        <Route path="/navigation" component={NavComponent} />
        <Route path="/tabs" component={Tabs} />
        <Route path="/issue/ion-modal-conditional-sibling" component={IonModalConditionalSibling} />
        <Route path="/issue/ion-modal-conditional" component={IonModalConditional} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
