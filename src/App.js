import React from 'react';
// Librerias necesarias para usar react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Importacion de hoja de estilos
import './App.css';

// Importacion de componentes
import { logoBase64 } from './componentes/ImagenBase64';

// Librerias para la creacion de rutas
import {
  BrowserRouter as Router,
  Link,
  Route
} from "react-router-dom";

// Importacion de herramientas de bootstrap
import { Navbar, Container, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';

function App() {
  const logo = logoBase64;
  return (
    <Router>
      <div>
        <div>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container fluid>
              <Navbar.Brand as={Link} to="/">
                <img
                  src={`data:image/png;base64, ${logo}`}
                  alt="Logo"
                />
              </Navbar.Brand>
              <Form className="d-flex ms-5 flex-grow-1">
                <FormControl type="search" placeholder="Buscar Pelicula" className="me-2 flex-grow-1" aria-label='Search' />
                <Button variant="outline-danger" className='search-button'>
                  <BsSearch />
                </Button>
              </Form>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-5 flex-grow-1">
                  <Nav.Link as={Link} to="/inicio">
                    Inicio
                  </Nav.Link>
                  <Nav.Link as={Link} to="/peliculas">
                    Películas
                  </Nav.Link>
                  <Nav.Link as={Link} to="/mi-cuenta">
                    Mi cuenta
                  </Nav.Link>
                  <Nav.Link as={Link} to="/notificaciones">
                    Notificaciones
                  </Nav.Link>
                  <Nav.Link as={Link} to="/comunidad">
                    Comunidad
                  </Nav.Link>
                  <Nav.Link as={Link} to="/sobre-nosotros">
                    Acerca de
                  </Nav.Link>

                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          {/* Aquí va el resto de tu contenido y rutas */}
        </div>
      </div>
    </Router>
  );
}


export default App;
