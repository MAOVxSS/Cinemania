import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from '../firebaseConfig/firebaseConfig';
import { Card,Row,Col } from 'react-bootstrap';

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

const ListaFavoritasUsuario = ({ uid }) => {
  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    const db = firebase.firestore();
    const listaSeguimientoCollection = db.collection('lista-seguimiento');
    const listaSeguimientoDocument = listaSeguimientoCollection.doc('datos');

    listaSeguimientoDocument
      .get()
      .then((doc) => {
        if (doc.exists) {
          const listaSeguimiento = doc.data().lista;
          const peliculasFavoritas = listaSeguimiento
            .filter((item) => item.uid === uid)
            .map((item) => item.peliculaId);

          obtenerPeliculasFavoritas(peliculasFavoritas);
        }
      })
      .catch((error) => {
        console.error('Error al obtener la lista de seguimiento:', error);
      });
  }, [uid]);

  const obtenerPeliculasFavoritas = (peliculasFavoritas) => {
    const apiKey = '7e7a5dfc44d92090d322e49610a9e8ba'; // Reemplaza con tu propia API Key de TMDB
  
    const promises = peliculasFavoritas.map((idPelicula) =>
      fetch(`https://api.themoviedb.org/3/movie/${idPelicula}?api_key=${apiKey}&language=es`)
        .then((response) => response.json())
    );
  
    Promise.all(promises)
      .then((data) => {
        const datosPeliculas = data.map((pelicula) => ({
          titulo: pelicula.title,
          imagen: `https://image.tmdb.org/t/p/w500/${pelicula.poster_path}`,
          descripcion: pelicula.overview
        }));
  
        setPeliculas(datosPeliculas);
      })
      .catch((error) => {
        console.error('Error al obtener los detalles de las películas:', error);
      });
  };
  

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {peliculas.map((pelicula, index) => (
        <Col key={index}>
          <Card className="mb-3">
            <Card.Img variant="top" src={pelicula.imagen} alt="Pelicula" />
            <Card.Body className='bg-dark text-white'>
              <Card.Title>{pelicula.titulo}</Card.Title>
              <Card.Text>{pelicula.descripcion}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ListaFavoritasUsuario;
