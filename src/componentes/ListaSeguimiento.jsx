import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const ListaSeguimiento = ({ currentUser }) => {
  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    if (currentUser) {
      obtenerPeliculas(currentUser.uid);
    } else {
      setPeliculas([]);
    }
  }, [currentUser]);

  const obtenerPeliculas = async (userId) => {
    try {
      const peliculasSnapshot = await db
        .collection('usuarios')
        .doc(userId)
        .collection('listaSeguimiento')
        .get();

      const peliculasData = peliculasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPeliculas(peliculasData);
    } catch (error) {
      console.error('Error al obtener las películas:', error);
    }
  };

  const eliminarPelicula = async (peliculaId) => {
    try {
      await db
        .collection('usuarios')
        .doc(currentUser.uid)
        .collection('listaSeguimiento')
        .doc(peliculaId)
        .delete();

      obtenerPeliculas(currentUser.uid);
    } catch (error) {
      console.error('Error al eliminar la película:', error);
    }
  };

  return (
    <div>
      <h1>Lista de Seguimiento</h1>
      {currentUser ? (
        <>
          <p>Bienvenido, {currentUser.displayName}</p>
          {peliculas.map((pelicula) => (
            <div key={pelicula.id}>
              <h2>{pelicula.titulo}</h2>
              <img src={pelicula.poster} alt={pelicula.titulo} />
              <button onClick={() => eliminarPelicula(pelicula.id)}>
                Eliminar
              </button>
            </div>
          ))}
        </>
      ) : (
        <p>Inicia sesión para ver tu lista de seguimiento.</p>
      )}
    </div>
  );
};

export default ListaSeguimiento;
