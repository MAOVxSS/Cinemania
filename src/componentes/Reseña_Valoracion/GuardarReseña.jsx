import React from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from '../firebaseConfig/firebaseConfig';
import { Button } from 'react-bootstrap';

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

const GuardarReseña = ({ peliculaId, reseña, onGuardar }) => {
  const guardarReseñaFirestore = async (peliculaId, reseña) => {
    try {
      const user = firebase.auth().currentUser;

      if (user) {
        const uid = user.uid;
        const db = firebase.firestore();
        const reseñasCollection = db.collection('reseñas');
        const datosDocument = await reseñasCollection.doc('datos').get();

        if (!datosDocument.exists) {
          console.log('El documento "datos" no existe en la colección "reseñas"');
          return;
        }

        const reseñasData = datosDocument.data().reseñas || [];
        const nuevaReseña = { uid, peliculaId, reseña };

        // Agregar la nueva reseña al arreglo existente
        reseñasData.push(nuevaReseña);

        // Actualizar el documento "datos" con las reseñas actualizadas
        await reseñasCollection.doc('datos').update({ reseñas: reseñasData });

        console.log('Reseña guardada correctamente:');
        console.log('- Usuario:', uid);
        console.log('- Película ID:', peliculaId);
        console.log('- Reseña:', reseña);
        onGuardar();
      } else {
        console.error('Usuario no autenticado.');
      }
    } catch (error) {
      console.error('Error al guardar la reseña:', error);
    }
  };

  const handleGuardarReseña = () => {
    guardarReseñaFirestore(peliculaId, reseña);
  };

  return (
    <Button variant="success" className="me-2" onClick={handleGuardarReseña}>
      Dar reseña
    </Button>
  );
};

export default GuardarReseña;
