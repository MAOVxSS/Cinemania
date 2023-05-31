import React, { useEffect, useState } from 'react';
// Hook
import { useLocation } from 'react-router-dom';
// Estilos
import { Container, Row, Col, Card, Pagination } from 'react-bootstrap';
import { FaExclamationCircle } from 'react-icons/fa';

// Para la solicitud HTTP
import axios from 'axios';

// Componentes
import InfoPelicula from '../ModalInfoPeli/InfoPelicula';

const ResultadosBusqueda = () => {
  // Estados para manejo de los resultados
  const [resultados, setResultados] = useState([]);
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null);
  // Estados para la paginacion
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [error, setError] = useState(null);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('query');
  const API_KEY = '7e7a5dfc44d92090d322e49610a9e8ba'; //API KEY

  useEffect(() => {
    // Función para buscar los resultados
    const buscarResultados = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es&query=${encodeURIComponent(
            searchQuery
          )}&page=${paginaActual}`
        );
        setResultados(response.data.results);
        setTotalPaginas(response.data.total_pages);
        setError(null);
      } catch (error) {
        console.error('Error al buscar los resultados:', error);
        setResultados([]);
        setTotalPaginas(1);
        setError('Ocurrió un error al buscar los resultados.');
      }
    };

    buscarResultados();
  }, [searchQuery, API_KEY, paginaActual]);

  const abrirModal = (pelicula) => {
    setPeliculaSeleccionada(pelicula);
  };

  const cerrarModal = () => {
    setPeliculaSeleccionada(null);
  };

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  const generarPaginacion = () => {
    const paginasMostradas = 5; // Número máximo de páginas a mostrar
    // Calcula el inicio del rango de páginas a mostrar
    const rangoInicio = Math.max(1, paginaActual - Math.floor(paginasMostradas / 2)); 
    // Calcula el fin del rango de páginas a mostrar
    const rangoFin = Math.min(totalPaginas, rangoInicio + paginasMostradas - 1); 
  
    // Genera un array de elementos de paginación
    return Array.from({ length: rangoFin - rangoInicio + 1 }, (_, index) => {
      const numeroPagina = rangoInicio + index;
      return (
        <Pagination.Item
          key={numeroPagina}
          active={numeroPagina === paginaActual}
          onClick={() => cambiarPagina(numeroPagina)}
        >
          {numeroPagina}
        </Pagination.Item>
      );
    });
  };
  

  return (
    <Container className="text-white">
      <h1>Resultados de búsqueda: {searchQuery}</h1>
      {/* Validación y mensaje de error */}
      {error ? (
        <Row className="justify-content-center">
          <Col xs={12} className="text-center">
            <div className="text-danger mb-3">
              <FaExclamationCircle size={40} />
            </div>
            <p>{error}</p>
          </Col>
        </Row>
      ) : (
        <>
          {/* Resultados de la búsqueda */}
          <Row>
            {resultados.map((pelicula) => (
              <Col key={pelicula.id} sm={6} md={4} lg={3} className="mb-4">
                <Card className="bg-dark mt-3 text-light" onClick={() => abrirModal(pelicula)}>
                  <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`} />
                  <Card.Body className="text-center">
                    <Card.Title>{pelicula.title}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <Row className="mt-4 justify-content-center">
              <Col>
                <Pagination className="justify-content-center">
                  <Pagination.First onClick={() => cambiarPagina(1)} disabled={paginaActual === 1} />
                  <Pagination.Prev onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1} />
                  {generarPaginacion()}
                  <Pagination.Next onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} />
                  <Pagination.Last onClick={() => cambiarPagina(totalPaginas)} disabled={paginaActual === totalPaginas} />
                </Pagination>
              </Col>
            </Row>
          )}
        </>
      )}
      {/* Modal de información de película */}
      <InfoPelicula pelicula={peliculaSeleccionada} onClose={cerrarModal} />
    </Container>
  );
};

export default ResultadosBusqueda;
