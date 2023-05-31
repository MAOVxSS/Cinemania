import React, { useState } from 'react';
// Librerias de estilo
import { Form, FormControl, Button } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';
// 
import { useNavigate } from 'react-router-dom';

const BusquedaBarra = () => {
  const [busqueda, setBusqueda] = useState(''); // Estado para almacenar el valor de búsqueda
  const navigate = useNavigate(); // Hook para navegar a la página de resultados

  // Manejador de cambios en el campo de búsqueda
  const handleChange = (event) => {
    setBusqueda(event.target.value);
  };

  // Manejador de envío del formulario de búsqueda
  const handleSubmit = (event) => {
    event.preventDefault();
    // Navega a la página de resultados con el valor de búsqueda codificado en la URL
    navigate(`/resultados?query=${encodeURIComponent(busqueda)}`); 
  };

  return (
    <Form className="d-flex ms-5 flex-grow-1" onSubmit={handleSubmit}>
      {/* Barra de busqueda */}
      <FormControl
        type="search"
        placeholder="Buscar Película"
        className="me-2 flex-grow-1"
        value={busqueda}
        onChange={handleChange}
        aria-label="Search"
      />
      <Button variant="outline-danger" className="search-button" type="submit">
        <BsSearch /> {/* Icono de búsqueda */}
      </Button>
    </Form>
  );
};

export default BusquedaBarra;
