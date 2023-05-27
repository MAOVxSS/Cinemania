import React from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from './firebaseConfig';

import { Button } from 'react-bootstrap';

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

const AñadirListaSeguimiento = ({ idPelicula }) => {

  const handleAñadirListaSeguimiento = () => {
    const user = firebase.auth().currentUser;

    if (user) {
      const db = firebase.firestore();
      const userCollection = db.collection(user.uid);
      const listaSeguimientoDocument = userCollection.doc('Lista-seguimiento');

      listaSeguimientoDocument.update({ [idPelicula]: true }).then(() => {
        console.log('Película agregada a la lista de seguimiento');
      }).catch((error) => {
        console.error('Error al agregar la película a la lista de seguimiento:', error);
      });
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={handleAñadirListaSeguimiento}>Añadir alista de seguimiento</Button>
    </div>
  );
};

export default AñadirListaSeguimiento;
