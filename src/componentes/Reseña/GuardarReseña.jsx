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
        const usuarioCollection = db.collection('usuarios').doc(uid).collection('reseñas');
        const reseñasDocument = usuarioCollection.doc('datos');

        // Obtener las reseñas existentes
        const doc = await reseñasDocument.get();
        const reseñas = doc.exists ? doc.data().reseñas : [];

        // Agregar la nueva reseña
        reseñas.push({ peliculaId, reseña });

        // Guardar las reseñas actualizadas en Firestore
        await reseñasDocument.set({ reseñas });

        console.log('Reseña guardada correctamente:', peliculaId, reseña);
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
