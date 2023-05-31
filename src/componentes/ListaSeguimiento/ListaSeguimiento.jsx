import React, { useEffect, useState } from 'react';
// Acceso a la firestore
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from '../firebaseConfig/firebaseConfig';

// Para solicitud HTTP
import axios from 'axios';
// Estilos
import { Card, Container, Row, Col, Pagination, Button } from 'react-bootstrap';

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

const ListaSeguimiento = () => {
  const API_KEY = '7e7a5dfc44d92090d322e49610a9e8ba';
  const [peliculas, setPeliculas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1); // Estado para la página actual
  const peliculasPorPagina = 4; // Número de películas a mostrar por página

  useEffect(() => {
    const user = firebase.auth().currentUser;

    if (user) {
      // acceso a la base de datos
      const db = firebase.firestore();
      const listaSeguimientoCollection = db.collection('lista-seguimiento');
      const listaSeguimientoDocument = listaSeguimientoCollection.doc('datos');

      listaSeguimientoDocument
        .get()
        .then((doc) => {
          if (doc.exists) {
            const lista = doc.data().lista;
            // Filtrar las películas según el uid del usuario actual
            const peliculasFiltradas = lista.filter((item) => item.uid === user.uid);
            // Obtener las IDs de las películas
            const peliculasIds = peliculasFiltradas.map((item) => item.peliculaId);
            // Obtener películas según las IDs de la lista de seguimiento
            obtenerPeliculas(peliculasIds);
          }
        })
        .catch((error) => {
          console.error('Error al obtener la lista de seguimiento:', error);
        });
    }
  }, []);

  // Funcion para hacer una consulta a la API con el id de la pelicula y obtner sus datos
  const obtenerPeliculas = async (ids) => {

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

  // Función para eliminar una película de la lista de seguimiento
  const eliminarPelicula = (id) => {
    const user = firebase.auth().currentUser;

    if (user) {
      const db = firebase.firestore();
      const listaSeguimientoCollection = db.collection('lista-seguimiento');
      const listaSeguimientoDocument = listaSeguimientoCollection.doc('datos');

      listaSeguimientoDocument
        .update({
          lista: firebase.firestore.FieldValue.arrayRemove({
            uid: user.uid,
            peliculaId: id
          })
        })
        .then(() => {
          console.log('Película eliminada de la lista de seguimiento');
          // Eliminar la película del estado
          setPeliculas((prevPeliculas) => prevPeliculas.filter((pelicula) => pelicula.id !== id));
        })
        .catch((error) => {
          console.error('Error al eliminar la película de la lista de seguimiento:', error);
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
        <h1>Lista de peliculas favoritas:</h1>
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

export default ListaSeguimiento;
