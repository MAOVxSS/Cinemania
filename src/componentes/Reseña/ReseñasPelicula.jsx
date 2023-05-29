import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from '../firebaseConfig/firebaseConfig';

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

const ReseñasPelicula = ({ peliculaId }) => {
  const [reseñas, setReseñas] = useState([]);

  useEffect(() => {
    obtenerReseñas();
  }, [peliculaId]);

  const obtenerReseñas = async () => {
    try {
      const usuario = firebase.auth().currentUser;

      if (usuario) {
        const uid = usuario.uid;
        const db = firebase.firestore();
        const usuarioDocument = db.collection('usuarios').doc(uid);
        const infoUsuarioDocument = await usuarioDocument.collection('info-usuario').doc("datos").get();

        if (infoUsuarioDocument.exists) {
          const apodo = infoUsuarioDocument.data().apodo; // Obtener el apodo del usuario
          const reseñasCollection = usuarioDocument.collection('reseñas');
          const datosDocument = await reseñasCollection.doc('datos').get();

          if (datosDocument.exists) {
            const reseñasData = datosDocument.data().reseñas || [];
            const reseñasFiltradas = reseñasData.filter(reseña => reseña.peliculaId === peliculaId);
            setReseñas(reseñasFiltradas.map(reseña => ({ usuario: apodo, reseña: reseña.reseña })));
            console.log('Reseñas:', reseñasFiltradas);
          } else {
            setReseñas([]);
            console.log('No hay reseñas disponibles');
          }
        } else {
          console.log('No se encontró información del usuario');
        }
      } else {
        console.log('Usuario no autenticado');
      }
    } catch (error) {
      console.error('Error al obtener las reseñas:', error);
    }
  };

  return (
    <div>
      <h2>Reseñas de la Película</h2>
      {reseñas.length > 0 ? (
        <ul>
          {reseñas.map((reseña, index) => (
            <li key={index}>
              <p>{`Usuario: ${reseña.usuario}`}</p>
              <p>{`Reseña: ${reseña.reseña}`}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay reseñas disponibles</p>
      )}
    </div>
  );
};

export default ReseñasPelicula;