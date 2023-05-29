import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from '../firebaseConfig/firebaseConfig';

// Para solicitud HTTP
import axios from 'axios';

import { Card, Container, Row, Col, Pagination, Button } from 'react-bootstrap';

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

const PorMirar = () => {
  const API_KEY = '7e7a5dfc44d92090d322e49610a9e8ba';
  const [peliculas, setPeliculas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1); // Estado para la página actual
  const peliculasPorPagina = 4; // Número de películas a mostrar por página

  useEffect(() => {
    const user = firebase.auth().currentUser;

    if (user) {
      const db = firebase.firestore();
      const userCollection = db.collection('usuarios').doc(user.uid).collection('por-mirar');
      const listaPorVerDocument = userCollection.doc('datos');

      listaPorVerDocument.get().then((doc) => {
        if (doc.exists) {
          const peliculasIds = Object.keys(doc.data());
          // Obtener películas según las IDs de la lista por ver
          obtenerPeliculas(peliculasIds);
        }
      }).catch((error) => {
        console.error('Error al obtener la lista por ver:', error);
      });
    }
  }, []);

  const obtenerPeliculas = async (ids) => {
    // Aquí debes realizar una solicitud a tu API o base de datos para obtener los detalles de las películas según las IDs
    // A continuación se muestra un ejemplo de cómo podrías hacerlo con axios:

    const requests = ids.map((id) =>
      axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=es`)
    );

    try {
      const responses = await axios.all(requests);
      const moviesData = responses.map((response) => response.data);
      setPeliculas(moviesData);
    } catch (error) {
      console.error('Error al obtener las películas:', error);
      setPeliculas([]);
    }
  };

  // Función para eliminar una película de la lista por ver
  const eliminarPelicula = (id) => {
    const user = firebase.auth().currentUser;

    if (user) {
      const db = firebase.firestore();
      const userCollection = db.collection('usuarios').doc(user.uid).collection('por-mirar');
      const listaPorVerDocument = userCollection.doc('datos');

      listaPorVerDocument.update({
        [id]: firebase.firestore.FieldValue.delete()
      })
        .then(() => {
          console.log('Película eliminada de la lista por ver');
          // Eliminar la película del estado
          setPeliculas((prevPeliculas) => prevPeliculas.filter((pelicula) => pelicula.id !== id));
        })
        .catch((error) => {
          console.error('Error al eliminar la película de la lista por ver:', error);
        });
    }
  };

  // Función para cambiar la página actual
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina); // Actualizar la página actual al hacer clic en un número de página
  };

  // Calcular el índice de inicio y fin de las películas a mostrar en la página actual
  const indiceInicio = (paginaActual - 1) * peliculasPorPagina;
  const indiceFin = indiceInicio + peliculasPorPagina;
  const peliculasPaginaActual = peliculas.slice(indiceInicio, indiceFin);

  // Calcular el número total de páginas
  const numeroTotalPaginas = Math.ceil(peliculas.length / peliculasPorPagina);

  // Efecto para ajustar la página actual si se eliminó la última película de la página actual
  useEffect(() => {
    if (peliculas.length > 0 && indiceInicio >= peliculas.length) {
      const nuevaPaginaActual = Math.ceil(peliculas.length / peliculasPorPagina);
      setPaginaActual(nuevaPaginaActual);
    }
  }, [peliculas, peliculasPorPagina, indiceInicio]);

  return (
    <Container className='text-white'>
      <div className='mw-320px text-align-center'>
        <h1>Lista de películas por ver:</h1>
      </div>
      <Row>
        {peliculasPaginaActual.map((pelicula) => (
          <Col sm={6} md={4} lg={3} key={pelicula.id}>
            <Card className='bg-dark mt-3 text-light'>
              <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`} />
              <Card.Body className='text-center'>
                <Card.Title>{pelicula.title}</Card.Title>
                <Button variant="danger" onClick={() => eliminarPelicula(pelicula.id)}>Eliminar</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {/* Paginación */}
      <div className='d-flex justify-content-center mt-4'>
        <Pagination>
          {Array.from({ length: numeroTotalPaginas }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === paginaActual}
              onClick={() => cambiarPagina(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </Container>
  );
};

export default PorMirar;
