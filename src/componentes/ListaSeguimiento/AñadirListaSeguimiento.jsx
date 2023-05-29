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
      const listaSeguimientoCollection = db.collection('lista-seguimiento');
      const listaSeguimientoDocument = listaSeguimientoCollection.doc('datos');

      listaSeguimientoDocument
        .get()
        .then((doc) => {
          if (!doc.exists) {
            // Crear el documento y la matriz si no existe
            listaSeguimientoDocument
              .set({
                lista: []
              })
              .then(() => {
                console.log('Documento y matriz creados');
              })
              .catch((error) => {
                console.error('Error al crear el documento y la matriz:', error);
              });
          }
        })
        .catch((error) => {
          console.error('Error al obtener el documento:', error);
        });
    }
  }, []);

  const handleAñadirListaSeguimiento = () => {
    const user = firebase.auth().currentUser;

    if (user) {
      const db = firebase.firestore();
      const listaSeguimientoCollection = db.collection('lista-seguimiento');
      const listaSeguimientoDocument = listaSeguimientoCollection.doc('datos');

      listaSeguimientoDocument
        .update({
          lista: firebase.firestore.FieldValue.arrayUnion({
            uid: user.uid,
            peliculaId: idPelicula
          })
        })
        .then(() => {
          console.log('Película agregada a la lista de seguimiento');
        })
        .catch((error) => {
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
