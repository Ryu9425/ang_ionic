import React, { useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton, IonLabel, IonCard, IonButton, useIonViewWillEnter } from '@ionic/react';
import { useParams, useLocation } from 'react-router';

interface DetailsProps {
}

const Details: React.FC<DetailsProps> = () => {

  const { id } = useParams<{ id: string; }>();

  const location = useLocation();

  useEffect(() => {
    console.log('Home Details mount');
    return () => console.log('Home Details unmount');
  }, []);

  // useIonViewWillEnter(() => {
  //   console.log('IVWE Details')
  // })

  const nextId = parseInt(id, 10) + 1;

  return (
    <IonPage data-pageid={`home-details-page-${id}`}>
      <IonHeader>
        <IonToolbar>
          <IonButtons>
            <IonBackButton defaultHref="/tabs/home"></IonBackButton>
          </IonButtons>
          <IonTitle>Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLabel data-testid="details-label">Details {id}</IonLabel>
        <br /><br />
        {location.search && (
          <>
            <IonLabel data-testid="query-label">Query Params: {location.search}</IonLabel>
            <br /><br />
          </>
        )}
        <IonButton routerLink={`/tabs/home/details/${nextId}`}>
          <IonLabel>Go to Details {nextId}</IonLabel>
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Details;