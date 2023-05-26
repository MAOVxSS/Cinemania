import React, { useState } from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const BusquedaBarra = () => {
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setBusqueda(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/resultados?query=${encodeURIComponent(busqueda)}`);
  };

  return (
    <Form className="d-flex ms-5 flex-grow-1" onSubmit={handleSubmit}>
      <FormControl
        type="search"
        placeholder="Buscar Pelicula"
        className="me-2 flex-grow-1"
        value={busqueda}
        onChange={handleChange}
        aria-label="Search"
      />
      <Button variant="outline-danger" className="search-button" type="submit">
        <BsSearch />
      </Button>
    </Form>
  );
};

export default BusquedaBarra;