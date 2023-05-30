import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from '../firebaseConfig/firebaseConfig';

// Componentes
import AñadirListaSeguimiento from '../ListaSeguimiento/AñadirListaSeguimiento';
import AñadirPorMirar from '../PorVer/AñadirPorMirar';
import GuardarReseña from '../Reseña/GuardarReseña';
import ReseñasPelicula from '../Reseña/ReseñasPelicula';

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

const InfoPelicula = ({ pelicula, onClose }) => {
  const [resena, setResena] = useState('');
  const [generos, setGeneros] = useState([]);

  const guardarResena = (e) => {
    setResena(e.target.value);
  };

  const limpiarResena = () => {
    setResena('');
  };

  useEffect(() => {
    obtenerGeneros();
  }, []);

  useEffect(() => {
    if (pelicula) {
      setResena('');
    }
  }, [pelicula]);

  const obtenerGeneros = async () => {
    const API_KEY = '7e7a5dfc44d92090d322e49610a9e8ba';
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es`
      );
      setGeneros(response.data.genres);
    } catch (error) {
      console.error('Error al obtener los géneros:', error);
    }
  };

  const obtenerNombresGeneros = (generoIds) => {
    const nombresGeneros = generoIds.map((generoId) => {
      const genero = generos.find((genero) => genero.id === generoId);
      return genero ? genero.name : '';
    });
    return nombresGeneros.join(', ');
  };

  const guardarHistorial = async (peliculaId) => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const uid = user.uid;
        const db = firebase.firestore();
        const historialRef = db.collection('historial').doc('datos');
        const historial = await historialRef.get();
  
        if (historial.exists) {
          // El documento 'datos' ya existe, verificamos si la película ya está en el historial
          const peliculas = historial.data().peliculas || [];
          const peliculaExistente = peliculas.find((pelicula) => pelicula.peliculaId === peliculaId && pelicula.uid === uid);
  
          if (!peliculaExistente) {
            // La película no está en el historial, la añadimos al array de películas
            peliculas.push({ peliculaId, uid });
            await historialRef.update({ peliculas });
            console.log('Película guardada en el historial:', peliculaId);
          } else {
            console.log('La película ya existe en el historial:', peliculaId);
          }
        } else {
          // El documento 'datos' no existe, lo creamos con el primer ID de película
          await historialRef.set({
            peliculas: [{ peliculaId, uid }],
          });
          console.log('Película guardada en el historial:', peliculaId);
        }
      } else {
        console.error('Usuario no autenticado.');
      }
    } catch (error) {
      console.error('Error al guardar el historial:', error);
    }
  };

  useEffect(() => {
    if (pelicula) {
      guardarHistorial(pelicula.id);
    }
  }, [pelicula]);

  if (!pelicula) {
    return null;
  }
  return (
    <Modal show={!!pelicula} onHide={onClose} dialogClassName="modal-xl">
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>{pelicula.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white">
        <Row>
          <Col md={4}>
            <img
              src={`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`}
              alt={pelicula.title}
              className="img-fluid"
            />
          </Col>
          <Col md={8}>
            <h5>Descripción:</h5>
            <p>{pelicula.overview}</p>
            <Row>
              <Col>
                <h5>Valoración:</h5>
                <p>{pelicula.vote_average} de 10.0</p>
              </Col>
              <Col>
                <h5>Total de votantes:</h5>
                <p>{pelicula.vote_count} personas</p>
              </Col>
            </Row>
            <h5>Fecha de estreno:</h5>
            <p>{pelicula.release_date}</p>
            <h5>Género:</h5>
            <p>{obtenerNombresGeneros(pelicula.genre_ids)}</p>
          </Col>
        </Row>
        <Form.Group controlId="resena">
          <Form.Label>Reseña:</Form.Label>
          <Form.Control as="textarea" rows={3} value={resena} onChange={guardarResena} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="bg-dark text-white">
        <Button variant="secondary" onClick={onClose} className="me-2">
          Salir
        </Button>
        {/* Boton de la lista de seguimiento o favoritos */}
        <AñadirListaSeguimiento idPelicula={pelicula.id} />
        {/* Boton para lista de peliculas POR VER */}
        <AñadirPorMirar idPelicula={pelicula.id} />
        {/* Guardar reseña */}
        <GuardarReseña peliculaId={pelicula.id} reseña={resena} onGuardar={limpiarResena} />
        <div className="rating-stars">
          <label>Valoración:</label>
          {/* Calificación */}
        </div>
          <ReseñasPelicula peliculaId={pelicula.id} />
      </Modal.Footer>
    </Modal>
  );
};

export default InfoPelicula;
