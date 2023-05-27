import React, { useState } from 'react';

// firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import firebaseConfig from './firebaseConfig';

import { Modal, Button, Nav, Alert, Form, InputGroup } from 'react-bootstrap';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { Link } from 'react-router-dom';

firebase.initializeApp(firebaseConfig);

const VentanaLogin = ({ onLogin, onLogout, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowSuccessMessage(false);
  };

  const handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        onLogin();
        setShowModal(false);
        setShowSuccessMessage(true);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        onLogout();
        setShowModal(false);
        setEmail('');
        setPassword('');
        setErrorMessage('');
        setShowSuccessMessage(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClearFields = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <div>
      <Nav.Link onClick={() => setShowModal(true)} className="btn btn-danger">Login</Nav.Link>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className='bg-dark text-white'>
          <Modal.Title>Iniciar sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark text-white'>
          {!showSuccessMessage ? (
            <Form>
              <Form.Group controlId="formEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control type="email" value={email} onChange={handleEmailChange} />
              </Form.Group>

              <Form.Group controlId="formPassword">
                <Form.Label>Contraseña:</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <InputGroup.Text onClick={toggleShowPassword}>
                    {showPassword ? <BsEyeSlash /> : <BsEye />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <Button className='mt-2' variant="primary" onClick={handleLogin}>Iniciar sesión</Button>
              <Button className='mt-2 mx-2' variant="secondary" onClick={handleClearFields}>Limpiar campos</Button>

              {errorMessage && <Alert className="mt-2" variant="danger">{errorMessage}</Alert>}
            </Form>
          ) : (
            <Alert variant="success">Inicio de sesión exitoso.</Alert>
          )}
        </Modal.Body>
        {showSuccessMessage && (
          <Modal.Footer>
            <Button variant="secondary" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Modal.Footer>
        )}
        <Modal.Footer className='bg-dark'>
          <div className="text-center w-100 bg-dark">
            <span className="text-muted">¿No tienes cuenta? </span>
            <Link to="/registro" className="text-primary" onClick={handleCloseModal}>Regístrate aquí</Link>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VentanaLogin;
