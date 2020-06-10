import React, { useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, useIonViewWillEnter, useIonViewWillLeave, useIonViewDidEnter, IonButtons, IonMenuButton, IonInput } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import { Link } from 'react-router-dom';

const Tab1: React.FC = () => {

  useEffect(() => {
    console.log('Home mount');
    return () => console.log('Home unmount');
  }, []);

  useIonViewWillEnter(() => {
    console.log('IVWE on tab1');
  })

  // useIonViewDidEnter(() => {
  //   console.log('IVDE on tab1');
  // })

  // useIonViewWillLeave(() => {
  //   console.log('IVWL tab1')
  // })

  return (
    <IonPage id="home" data-pageid="home-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
  
        <IonList>
          <IonItem routerLink='/tabs/home/details/1'>
            <IonLabel>Details 1</IonLabel>
          </IonItem>
          <IonItem routerLink='/tabs/home/details/1?hello=there'>
            <IonLabel>Details 1 with Query Params</IonLabel>
          </IonItem>
          <IonItem routerLink='/tabs/settings/details/1'>
            <IonLabel>Details 1 on settings</IonLabel>
          </IonItem>
          <IonItem routerLink='/otherpage'>
            <IonLabel>Other Page</IonLabel>
          </IonItem>
        </IonList>
        <Link to="/tabs/home/details/1">
          Go to details 1 via link
        </Link>
        <br /><br />
        <Link to="/tabs/settings/details/1">
          Go to details 1 on settings
        </Link>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
