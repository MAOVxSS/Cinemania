import React, { useEffect, useState, useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const Notificaciones = () => {
  // Estados para almacenar las notificaciones, usuarios, películas y visibilidad del modal
  const [notificaciones, setNotificaciones] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [peliculas, setPeliculas] = useState({});
  const [modalVisible, setModalVisible] = useState(true);

    // Función para obtener información de las películas recomendadas
    const obtenerInformacionPeliculas = useCallback(async (peliculasIDs) => {
      try {
        const apiKey = '7e7a5dfc44d92090d322e49610a9e8ba';
        const requests = peliculasIDs.map((peliculaID) =>
          fetch(`https://api.themoviedb.org/3/movie/${peliculaID}?api_key=${apiKey}&language=es`)
        );
        const responses = await Promise.all(requests);
        const peliculasData = {};
        for (const response of responses) {
          const pelicula = await response.json();
          peliculasData[pelicula.id] = {
            titulo: pelicula.title,
            poster: pelicula.poster_path,
          };
        }
        setPeliculas(peliculasData);
      } catch (error) {
        console.error('Error al obtener la información de las películas:', error);
      }
    }, []);

       // Función para obtener los nombres de los usuarios que han enviado las notificaciones
  const obtenerNombresUsuarios = useCallback(async (usuariosUIDs) => {
    try {
      const db = firebase.firestore();
      const usuariosSnapshot = await db.collection('info-usuario').doc('datos').get();
      if (usuariosSnapshot.exists) {
        const usuariosData = usuariosSnapshot.data().datos || [];
        const usuariosObject = {};
        usuariosData.forEach((usuario) => {
          if (usuariosUIDs.includes(usuario.uid)) {
            usuariosObject[usuario.uid] = usuario.apodo;
          }
        });
        setUsuarios(usuariosObject);
      }
    } catch (error) {
      console.error('Error al obtener los nombres de usuario:', error);
    }
  }, []);

  // Función para obtener las notificaciones del usuario actual
  const obtenerNotificaciones = useCallback(async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const uidRecomendado = user.uid;

        const db = firebase.firestore();
        const notificacionesSnapshot = await db
          .collection('recomendaciones')
          .doc('datos')
          .get();

        if (notificacionesSnapshot.exists) {
          const notificacionesData = notificacionesSnapshot.data().datos || [];
          const notificacionesFiltradas = notificacionesData.filter(
            (notificacion) => notificacion.uidRecomendado === uidRecomendado
          );

          setNotificaciones(notificacionesFiltradas);

          const usuariosUIDs = notificacionesFiltradas.map(
            (notificacion) => notificacion.uidRecomendador
          );
          obtenerNombresUsuarios(usuariosUIDs);

          const peliculasIDs = notificacionesFiltradas.map(
            (notificacion) => notificacion.idPelicula
          );
          obtenerInformacionPeliculas(peliculasIDs);
        }
      } else {
        console.error('Usuario no autenticado');
      }
    } catch (error) {
      console.error('Error al obtener las notificaciones:', error);
    }
  }, [obtenerInformacionPeliculas, obtenerNombresUsuarios]);





  useEffect(() => {
    obtenerNotificaciones();
  }, [obtenerNotificaciones]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <Modal show={modalVisible} onHide={toggleModal}>
      <Modal.Header closeButton>
        <Modal.Title>Notificaciones</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {notificaciones.length > 0 ? (
          <ul className="list-group">
            {notificaciones.map((notificacion, index) => (
              <li className="list-group-item" key={index}>
                <h6>{usuarios[notificacion.uidRecomendador]} te ha recomendado:</h6>
                <div className="d-flex align-items-center">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${peliculas[notificacion.idPelicula]?.poster}`}
                    alt={peliculas[notificacion.idPelicula]?.titulo}
                    style={{ width: '50px', marginRight: '10px' }}
                  />
                  <span>{peliculas[notificacion.idPelicula]?.titulo}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes notificaciones</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Notificaciones;
