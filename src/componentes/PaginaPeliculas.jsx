import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Pagination } from 'react-bootstrap';
import axios from 'axios';

import InfoPelicula from './InfoPelicula';

const PaginaPeliculas = () => {
  const API_KEY = '7e7a5dfc44d92090d322e49610a9e8ba';
  const perPage = 12;

  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null);
  const [letraSeleccionada, setLetraSeleccionada] = useState('');
  const [peliculas, setPeliculas] = useState([]);
  const [peliculasPaginadas, setPeliculasPaginadas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleCloseModal = () => {
    setPeliculaSeleccionada(null);
  };

  const handleOpenModal = (pelicula) => {
    setPeliculaSeleccionada(pelicula);
  };

  const obtenerPeliculasFiltradas = async (letra) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es&query=${letra}`
      );
      const peliculasFiltradas = response.data.results.filter(
        (pelicula) => pelicula.title.charAt(0).toUpperCase() === letra.toUpperCase()
      );
      setTotalPages(Math.ceil(peliculasFiltradas.length / perPage));
      console.log(peliculasFiltradas); // Mostrar las películas filtradas en la consola
      return peliculasFiltradas;
    } catch (error) {
      console.error('Error al obtener las películas:', error);
      return [];
    }
  };

  const handleLetraSeleccionada = async (letra) => {
    setLetraSeleccionada(letra);
    const peliculasFiltradas = await obtenerPeliculasFiltradas(letra);
    setPeliculas(peliculasFiltradas);
    setCurrentPage(1);
  };

  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const peliculasFiltradas = peliculas.slice(start, end);
    setPeliculasPaginadas(peliculasFiltradas);
  }, [peliculas, currentPage]);

  useEffect(() => {
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const peliculasFiltradas = peliculas.slice(start, end);
    setPeliculasPaginadas(peliculasFiltradas);
  }, [peliculas, currentPage]);

  const renderLetrasAbecedario = () => {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    return letras.split('').map((letra) => (
      <Col key={letra} xs={2} className="mb-2">
        <Form.Check
          type="radio"
          label={letra}
          name="filtroLetra"
          id={`filtroLetra-${letra}`}
          onChange={() => handleLetraSeleccionada(letra)}
          checked={letraSeleccionada === letra}
        />
      </Col>
    ));
  };

  return (
    <div>
      <Container>
        <Row>
          <Col md={4} className="bg-dark text-white p-4 mr-md-auto">
            <h3 className="mb-3">Filtros</h3>
            <div>
              <h5 className="text-white">Letra inicial:</h5>
              <Row>{renderLetrasAbecedario()}</Row>
            </div>
          </Col>
          <Col md={8} className="ml-md-auto text-white">
            <h3>Películas</h3>
            <Row>
              {peliculasPaginadas.map((pelicula) => (
                <Col key={pelicula.id} md={4}>
                  <div onClick={() => handleOpenModal(pelicula)}>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`}
                      alt={pelicula.title}
                      className="img-fluid"
                    />
                    <h5>{pelicula.title}</h5>
                  </div>
                </Col>
              ))}
            </Row>
            {peliculas.length > 0 && (
              <div className="mt-4 d-flex justify-content-center">
                <Pagination>
                  <Pagination.First onClick={() => handlePageChange(1)} />
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Pagination.Item
                      key={page}
                      active={page === currentPage}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last onClick={() => handlePageChange(totalPages)} />
                </Pagination>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <InfoPelicula pelicula={peliculaSeleccionada} onClose={handleCloseModal} />
    </div>
  );
};

export default PaginaPeliculas;
