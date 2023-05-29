import React from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from '../firebaseConfig/firebaseConfig';

import { Button } from 'react-bootstrap';

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

const AñadirPorMirar = ({ idPelicula }) => {
  const handleAñadirPorMirar = () => {
    const user = firebase.auth().currentUser;

    if (user) {
      const db = firebase.firestore();
      const listaMirarDocument = db.collection('lista-mirar').doc('datos');

      listaMirarDocument.get().then((doc) => {
        if (!doc.exists) {
          // Crear la colección y el documento si no existen
          listaMirarDocument
            .set({ lista: [{ uid: user.uid, peliculaId: idPelicula }] })
            .then(() => {
              console.log('Colección y documento creados');
            })
            .catch((error) => {
              console.error('Error al crear la colección y el documento:', error);
            });
        } else {
          // Agregar la película a la lista si el documento ya existe
          listaMirarDocument
            .update({
              lista: firebase.firestore.FieldValue.arrayUnion({ uid: user.uid, peliculaId: idPelicula })
            })
            .then(() => {
              console.log('Película agregada a la lista por ver');
            })
            .catch((error) => {
              console.error('Error al agregar la película a la lista por ver:', error);
            });
        }
      }).catch((error) => {
        console.error('Error al obtener el documento:', error);
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
