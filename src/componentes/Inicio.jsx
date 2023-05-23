import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getPopularMovies } from './API';
import InfoPelicula from './InfoPelicula';

export const Inicio = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null);

  useEffect(() => {
    const obtenerPeliculasPopulares = async () => {
      const peliculasPopulares = await getPopularMovies();
      setPeliculas(peliculasPopulares);
    };

    obtenerPeliculasPopulares();
  }, []);

  const abrirModal = (pelicula) => {
    setPeliculaSeleccionada(pelicula);
  };

  const cerrarModal = () => {
    setPeliculaSeleccionada(null);
  };

  return (
    <Container className='text-white'>
      <h1>Películas populares</h1>
      <Row>
        {peliculas.map((pelicula) => (
          <Col sm={6} md={4} lg={3} key={pelicula.id}>
            <Card className='bg-dark mt-3 text-light' onClick={() => abrirModal(pelicula)}>
              <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`} />
              <Card.Body>
                <Card.Title>{pelicula.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <InfoPelicula pelicula={peliculaSeleccionada} onClose={cerrarModal} />
    </Container>
  );
};
