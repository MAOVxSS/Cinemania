import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from '../firebaseConfig/firebaseConfig';

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

const ResenasPelicula = ({ peliculaId }) => {
  const [reseñas, setReseñas] = useState([]);

  useEffect(() => {
    const db = firebase.firestore();
    const reseñasCollection = db.collection('reseñas');
    const reseñasDocument = reseñasCollection.doc('datos');

    reseñasDocument
      .get()
      .then((doc) => {
        if (doc.exists) {
          const listaReseñas = doc.data().reseñas;
          const reseñasFiltradas = listaReseñas.filter((res) => res.peliculaId === peliculaId);
          setReseñas(reseñasFiltradas);
        }
      })
      .catch((error) => {
        console.error('Error al obtener las reseñas:', error);
      });
  }, [peliculaId]);

  return (
    <div>
      {reseñas.length > 0 ? (
        <ul>
          {reseñas.map((res, index) => (
            <li key={`${res.uid}-${index}`}>
              <p>Reseña: {res.reseña}</p>
              <p>Usuario ID: {res.uid}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay reseñas disponibles para esta película.</p>
      )}
    </div>
  );
};

export default ResenasPelicula;
