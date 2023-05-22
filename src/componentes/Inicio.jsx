// Se importa useState para el uso de estados que servira en la API
import React, { useEffect, useState } from 'react';
// Paqueteria de bootstrap para los estilos
import { Card, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// Importacion el hook para el acceso a la API
import { getPopularMovies } from './API';

export const Inicio = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const popularMovies = await getPopularMovies();
      setMovies(popularMovies);
    };

    fetchMovies();
  }, []);

  return (
    <Container className='text-white'>
      <Row>
        {movies.map((movie) => (
          <Col sm={6} md={4} lg={3} key={movie.id}>
            <Card className='bg-dark mt-3 text-light '>
              <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};