import React, { useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from '../firebaseConfig/firebaseConfig';

import { Button } from 'react-bootstrap';

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

const AñadirListaSeguimiento = ({ idPelicula }) => {

  useEffect(() => {
    const user = firebase.auth().currentUser;

    if (user) {
      const db = firebase.firestore();
      const userCollection = db.collection(user.uid);
      const userDocument = userCollection.doc('Lista-seguimiento');

      userDocument.get().then((doc) => {
        if (!doc.exists) {
          // Crear la colección y el documento si el usuario es nuevo
          userDocument.set({ [idPelicula]: true }).then(() => {
            console.log('Colección y documento creados');
          }).catch((error) => {
            console.error('Error al crear la colección y el documento:', error);
          });
        }
      }).catch((error) => {
        console.error('Error al obtener el documento:', error);
      });
    }
  }, [idPelicula]);

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
      <Button variant="primary" onClick={handleAñadirListaSeguimiento} className='me-2'>
        Añadir a Lista de Seguimiento
      </Button>
    </div>
  );
};

export default AñadirListaSeguimiento;
