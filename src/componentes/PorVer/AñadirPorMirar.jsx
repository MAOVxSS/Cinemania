import React, { useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from '../firebaseConfig/firebaseConfig';

import { Button } from 'react-bootstrap';

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

const AñadirPorMirar = ({ idPelicula }) => {
  useEffect(() => {
    const user = firebase.auth().currentUser;

    if (user) {
      const db = firebase.firestore();
      const userCollection = db.collection(user.uid);
      const listaPorVerDocument = userCollection.doc('lista-por-ver');

      listaPorVerDocument.get().then((doc) => {
        if (!doc.exists) {
          // Crear la colección y el documento si el usuario es nuevo
          listaPorVerDocument
            .set({ [idPelicula]: true })
            .then(() => {
              console.log('Colección y documento creados');
            })
            .catch((error) => {
              console.error('Error al crear la colección y el documento:', error);
            });
        }
      }).catch((error) => {
        console.error('Error al obtener el documento:', error);
      });
    }
  }, [idPelicula]);

  const handleAñadirPorMirar = () => {
    const user = firebase.auth().currentUser;

    if (user) {
      const db = firebase.firestore();
      const userCollection = db.collection(user.uid);
      const listaPorVerDocument = userCollection.doc('lista-por-ver');

      listaPorVerDocument
        .update({ [idPelicula]: true })
        .then(() => {
          console.log('Película agregada a la lista por ver');
        })
        .catch((error) => {
          console.error('Error al agregar la película a la lista por ver:', error);
        });
    }
  };

  return (
    <div>
      <Button variant="info" onClick={handleAñadirPorMirar} className='me-2'>
        Por Mirar
      </Button>
    </div>
  );
};

export default AñadirPorMirar;
