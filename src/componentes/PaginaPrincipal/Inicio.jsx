import React, { useEffect, useState } from 'react';
// Componentes para los estilos
import { Card, Container, Row, Col, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// Componentes para acceso a la API y mostrar datos
import InfoPelicula from '../ModalInfoPeli/InfoPelicula';
// Para solicitud HTTP
import axios from 'axios';

export const Inicio = () => {
  const [peliculas, setPeliculas] = useState([]); // Estado para almacenar las películas
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null); // Estado para la película seleccionada
  const [paginaActual, setPaginaActual] = useState(1); // Estado para la página actual
  const peliculasPorPagina = 8; // Número de películas a mostrar por página
  // Clave de la Api
  const API_KEY = '7e7a5dfc44d92090d322e49610a9e8ba';

  useEffect(() => {
    const obtenerPeliculasPopulares = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es`
        );
        setPeliculas(response.data.results);
      } catch (error) {
        console.error('Error al obtener las películas:', error);
        setPeliculas([]);
      }
    };

    obtenerPeliculasPopulares(); // Obtener las películas populares al cargar el componente
  }, []);

  const abrirModal = (pelicula) => {
    setPeliculaSeleccionada(pelicula); // Establecer la película seleccionada para mostrar en el modal
  };

  const cerrarModal = () => {
    setPeliculaSeleccionada(null); // Cerrar el modal al establecer la película seleccionada como nula
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

  return (
    <Container className='text-white'>
      <div className='mw-320px text-align-center'>
        <h1>Películas populares</h1>
      </div>
      <Row>
        {peliculasPaginaActual.map((pelicula) => ( //Funcion map para mostrar las peliculas en tarjetas
          <Col sm={6} md={4} lg={3} key={pelicula.id}>
            <Card className='bg-dark mt-3 text-light' onClick={() => abrirModal(pelicula)}>
              <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`} />
              <Card.Body className='text-center'> {/*Aqui se mostrara la informacion que se quiera en la tarjeta*/}
                <Card.Title>{pelicula.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <InfoPelicula pelicula={peliculaSeleccionada} onClose={cerrarModal} />

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
