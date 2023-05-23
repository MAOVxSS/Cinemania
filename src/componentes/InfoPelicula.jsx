import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const InfoPelicula = ({ pelicula, onClose }) => {
  const [resena, setResena] = useState('');

  const guardarResena = (e) => {
    setResena(e.target.value);
  };

  // Si no hay pelicula seleccionada no se muestra el modal
  if (!pelicula) {
    return null;
  }

  return (
    // Funcionamento y vista de la ventana modal
    <Modal show={!!pelicula} onHide={onClose}>
      <Modal.Header closeButton className='bg-dark text-white'>
        <Modal.Title>{pelicula.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='bg-dark text-white'>
        <div className="row">
          <div className="col-md-4">
            <img src={`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`} alt={pelicula.title} className="img-fluid" />
          </div>
          <div className="col-md-8">
            <h5>Descripción:</h5>
            <p>{pelicula.overview}</p>
            <h5>Valoracion:</h5>
            <p>{pelicula.vote_average} de 10.0</p>
            <h5>Total de votantes:</h5>
            <p>{pelicula.vote_count} personas</p>
            <h5>Fecha de estreno:</h5>
            <p>{pelicula.release_date}</p>
            {/* Agregar más detalles de la película según la API */}
          </div>
        </div>
        {/* Formulario para la reseña */}
        <Form.Group controlId="resena">
          <Form.Label>Reseña:</Form.Label>
          <Form.Control as="textarea" rows={3} value={resena} onChange={guardarResena} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className='bg-dark text-white'>
        <Button variant="secondary" onClick={onClose}>
          Salir
        </Button>
        <Button variant="primary">
          Agregar a Lista de seguimiento
        </Button>
        <Button variant="primary">
          Dar reseña
        </Button>
        <div className="rating-stars">
          <label>Valoración:</label>
          {/* Calificación */}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default InfoPelicula;
