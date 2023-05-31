import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Pagination,
  OverlayTrigger,
  Tooltip,
  Button
} from 'react-bootstrap';
import axios from 'axios';

import { FaArrowRight } from 'react-icons/fa';

import InfoPelicula from '../ModalInfoPeli/InfoPelicula';

const PaginaPeliculas = () => {
  // Clave de API para el servicio externo
  const API_KEY = '7e7a5dfc44d92090d322e49610a9e8ba';
  const perPage = 5;

  // Estado para la película seleccionada en el modal
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null);
  // Estado para la letra seleccionada en el filtro
  const [letraSeleccionada, setLetraSeleccionada] = useState('');
  // Estado para el género seleccionado en el filtro
  const [generoSeleccionado, setGeneroSeleccionado] = useState('');
  // Estado para el año de búsqueda
  const [anioBusqueda, setAnioBusqueda] = useState('');
  // Estado para la lista completa de películas
  const [peliculas, setPeliculas] = useState([]);
  // Estado para las películas mostradas en la página actual
  const [peliculasPaginadas, setPeliculasPaginadas] = useState([]);
  // Estado para el número de página actual
  const [currentPage, setCurrentPage] = useState(1);
  // Estado para el número total de páginas
  const [totalPages, setTotalPages] = useState(0);
  // Estado para la lista de géneros
  const [generos, setGeneros] = useState([]);

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setPeliculaSeleccionada(null);
  };

  // Función para abrir el modal con una película
  const handleOpenModal = (pelicula) => {
    setPeliculaSeleccionada(pelicula);
  };

  // Obtener las películas filtradas por letra inicial
  const obtenerPeliculasFiltradasPorLetra = async (letra) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es&query=${letra}`
      );
      const peliculasFiltradas = response.data.results.filter(
        (pelicula) => pelicula.title.charAt(0).toUpperCase() === letra.toUpperCase()
      );
      setTotalPages(Math.ceil(peliculasFiltradas.length / perPage));
      return peliculasFiltradas;
    } catch (error) {
      console.error('Error al obtener las películas:', error);
      return [];
    }
  };

  // Obtener las películas filtradas por género
  const obtenerPeliculasFiltradasPorGenero = async (generoId) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es&with_genres=${generoId}`
      );
      const peliculasFiltradas = response.data.results;
      setTotalPages(Math.ceil(peliculasFiltradas.length / perPage));
      return peliculasFiltradas;
    } catch (error) {
      console.error('Error al obtener las películas:', error);
      return [];
    }
  };

  // Obtener las películas filtradas por año
  const obtenerPeliculasFiltradasPorAnio = async (anio) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es&primary_release_year=${anio}`
      );
      const peliculasFiltradas = response.data.results;
      setTotalPages(Math.ceil(peliculasFiltradas.length / perPage));
      return peliculasFiltradas;
    } catch (error) {
      console.error('Error al obtener las películas:', error);
      return [];
    }
  };

  // Obtener la lista de géneros
  const obtenerGeneros = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es`
      );
      setGeneros(response.data.genres);
    } catch (error) {
      console.error('Error al obtener los géneros:', error);
      setGeneros([]);
    }
  };

  // Manejar la selección de letra
  const handleLetraSeleccionada = async (letra) => {
    setLetraSeleccionada(letra);
    setGeneroSeleccionado('');
    setAnioBusqueda('');

    if (letra) {
      const peliculasFiltradas = await obtenerPeliculasFiltradasPorLetra(letra);
      setPeliculas(peliculasFiltradas);
      setCurrentPage(1);
    }
  };

  // Manejar la selección de género
  const handleGeneroSeleccionado = async (generoId) => {
    setGeneroSeleccionado(generoId);
    setLetraSeleccionada('');
    setAnioBusqueda('');

    if (generoId) {
      const peliculasFiltradas = await obtenerPeliculasFiltradasPorGenero(generoId);
      setPeliculas(peliculasFiltradas);
      setCurrentPage(1);
    } else {
      handleLetraSeleccionada(letraSeleccionada);
    }
  };

  // Manejar el cambio de año de búsqueda
  const handleAnioBusqueda = (e) => {
    setAnioBusqueda(e.target.value);
  };

  // Realizar la búsqueda por año
  const buscarPorAnio = async () => {
    if (anioBusqueda) {
      const peliculasFiltradas = await obtenerPeliculasFiltradasPorAnio(anioBusqueda);
      setPeliculas(peliculasFiltradas);
      setCurrentPage(1);
      setLetraSeleccionada('');
      setGeneroSeleccionado('');
    }
  };

  // Manejar el cambio de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Actualizar las películas mostradas en la página actual
  useEffect(() => {
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const peliculasFiltradas = peliculas.slice(start, end);
    setPeliculasPaginadas(peliculasFiltradas);
  }, [peliculas, currentPage]);

  // Obtener la lista de géneros al cargar el componente
  useEffect(() => {
    obtenerGeneros();
  }, []);

  // Renderizar las opciones de letras del abecedario
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

  // Renderizar las opciones de género
  const renderGeneros = () => {
    return (
      <Form.Group controlId="genero">
        <h5 className="text-white">Género:</h5>
        <Form.Control as="select" value={generoSeleccionado} onChange={(e) => handleGeneroSeleccionado(e.target.value)}>
          <option value="">Sin opción</option>
          {generos.map((genero) => (
            <option key={genero.id} value={genero.id}>{genero.name}</option>
          ))}
        </Form.Control>
      </Form.Group>
    );
  };

  // Renderizar el formulario de búsqueda por año
  const renderAnioBusqueda = () => {
    return (
      <Form.Group controlId="anio" className='mt-2'>
        <h5 className="text-white">Buscar por año:</h5>
        <Row>
          <Col md={8}>
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Ingresa el año en formato de 4 dígitos (ej. 2021)</Tooltip>}
            >
              <Form.Control
                type="text"
                placeholder="Año"
                value={anioBusqueda}
                onChange={handleAnioBusqueda}
                className="mr-2"
              />
            </OverlayTrigger>
          </Col>
          <Col md={4}>
            <Button variant="primary" onClick={buscarPorAnio}>
              <FaArrowRight />
            </Button>
          </Col>
        </Row>
      </Form.Group>
    );
  };

  // Renderizar el componente
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
            <div>{renderGeneros()}</div>
            <div>{renderAnioBusqueda()}</div>
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <Pagination.Item
                      key={pageNumber}
                      active={pageNumber === currentPage}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      {peliculaSeleccionada && (
        <InfoPelicula pelicula={peliculaSeleccionada} handleClose={handleCloseModal} />
      )}
    </div>
  );
};

export default PaginaPeliculas;
