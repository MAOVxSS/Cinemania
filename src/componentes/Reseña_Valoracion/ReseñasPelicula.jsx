import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from '../firebaseConfig/firebaseConfig';
import ValoracionEstrellas from './ValoracionEstrellas';

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

const ResenasPelicula = ({ peliculaId }) => {
  const [reseñas, setReseñas] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [valoraciones, setValoraciones] = useState({});

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

          // Obtiene los UIDs de los usuarios en las reseñas filtradas
          const usuariosUIDs = reseñasFiltradas.map((res) => res.uid);
          obtenerNombresUsuarios(usuariosUIDs);
          obtenerValoraciones(usuariosUIDs);
        }
      })
      .catch((error) => {
        console.error('Error al obtener las reseñas:', error);
      });
  }, [peliculaId]);

  const obtenerNombresUsuarios = (usuariosUIDs) => {
    const db = firebase.firestore();
    const usuariosCollection = db.collection('info-usuario');
    const usuariosDocument = usuariosCollection.doc('datos');

    usuariosDocument
      .get()
      .then((doc) => {
        if (doc.exists) {
          const listaUsuarios = doc.data().datos;
          const usuariosFiltrados = listaUsuarios.filter((usuario) =>
            usuariosUIDs.includes(usuario.uid)
          );
          const usuariosObject = {};
          usuariosFiltrados.forEach((usuario) => {
            usuariosObject[usuario.uid] = usuario.apodo;
          });
          setUsuarios(usuariosObject);
        }
      })
      
      .catch((error) => {
        console.error('Error al obtener la información de usuario:', error);
      });
  };

  const obtenerValoraciones = (usuariosUIDs) => {
    const db = firebase.firestore();
    const valoracionCollection = db.collection('valoracion');
    const valoracionDocument = valoracionCollection.doc('datos');

    valoracionDocument
      .get()
      .then((doc) => {
        if (doc.exists) {
          const listaValoraciones = doc.data().datos;
          const valoracionesObject = {};
          usuariosUIDs.forEach((uid) => {
            const valoracionUsuario = listaValoraciones.find((valoracion) => valoracion.uid === uid);
            if (valoracionUsuario) {
              valoracionesObject[uid] = valoracionUsuario.valor;
            }
          });
          setValoraciones(valoracionesObject);
        }
      })
      .catch((error) => {
        console.error('Error al obtener las valoraciones:', error);
      });
  };

  return (
    <div className="modal-content bg-dark">
      <div className="modal-header text-center">
        <h5 className="modal-title">Reseñas de la película</h5>
      </div>
      <div className="modal-body">
        {reseñas.length > 0 ? (
          <ul className="list-group">
            {reseñas.map((res, index) => (
              <li className="list-group-item" key={`${res.uid}-${index}`}>
                <p className="mb-0">Usuario: {usuarios[res.uid]}</p>
                <p className="mb-1">Reseña: {res.reseña}</p>
                {valoraciones[res.uid] && (
                  <ValoracionEstrellas valoracion={valoraciones[res.uid]} />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">No hay reseñas disponibles para esta película.</p>
        )}
      </div>
    </div>
  );
};

export default ResenasPelicula;