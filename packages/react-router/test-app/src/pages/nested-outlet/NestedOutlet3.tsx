import React from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

const List: React.FC = () => {
  return (
    <IonPage data-pageid="list">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>List</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem detail routerLink="/nested-outlet3/list/1">
            Item #1
          </IonItem>
          <IonItem detail routerLink="/nested-outlet3/list/2">
            Item #2
          </IonItem>
          <IonItem detail routerLink="/nested-outlet3/list/3">
            Item #3
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

const Item: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  return (
    <IonPage data-pageid="item">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Item</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>Detail of item #{match.params.id}</IonContent>
    </IonPage>
  );
};

const Home: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  return (
    <IonPage data-pageid="home">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem routerLink="/nested-outlet3/list">
            <IonLabel>Go to List Page</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

const NestedOutlet3: React.FC = () => (
  <IonRouterOutlet id="main">
    <Route path="/nested-outlet3/list" component={List} exact />
    <Route path="/nested-outlet3/list/:id" component={Item} />
    <Route path="/nested-outlet3/home" component={Home} />
      <Route
      path="/nested-outlet3"
      render={() => <Redirect to="/nested-outlet3/home" />}
      exact={true}
    />
  </IonRouterOutlet>
);

export default NestedOutlet3;
