import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';

const RegistroUsuario = () => {
  const navigate = useNavigate();

  const [correoElectronico, setCorreoElectronico] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [errorRegistro, setErrorRegistro] = useState('');
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const handleRegistro = (e) => {
    e.preventDefault();

    setErrorRegistro('');
    setRegistroExitoso(false);

    if (contrasena !== confirmarContrasena) {
      setErrorRegistro('Las contraseñas no coinciden.');
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(correoElectronico, contrasena)
      .then((userCredential) => {
        // Registro exitoso
        setRegistroExitoso(true);
      })
      .catch((error) => {
        // Error al registrar al usuario
        setErrorRegistro(error.message);
      });
  };

  const handleCloseModal = () => {
    setRegistroExitoso(false);
    navigate('/');
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} sm={8} md={6}>
          <h2 className="text-center mb-4 text-white">Registro de Nuevo Usuario</h2>
          <Form onSubmit={handleRegistro} className='text-white'>
            <Form.Group controlId="formCorreoElectronico">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese su correo electrónico"
                value={correoElectronico}
                onChange={(e) => setCorreoElectronico(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formContrasena" className='mt-2'>
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese su contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formConfirmarContrasena" className='mt-2'>
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirme su contraseña"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-2">
              Registrarse
            </Button>
          </Form>
        </Col>
      </Row>

      {/* Modal de registro exitoso */}
      <Modal show={registroExitoso} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Registro Exitoso</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <p>Tu registro ha sido exitoso. ¡Bienvenido(a)!</p>
        </Modal.Body>
        <Modal.Footer className="bg-dark text-white">
          <Button variant="primary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de error de registro */}
      <Modal show={!!errorRegistro} onHide={() => setErrorRegistro('')} centered>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Error de Registro</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <p>Se ha producido un error durante el registro: {errorRegistro}</p>
        </Modal.Body>
        <Modal.Footer className="bg-dark text-white">
          <Button variant="primary" onClick={() => setErrorRegistro('')}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RegistroUsuario;
