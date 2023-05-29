import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from '../firebaseConfig/firebaseConfig';
import { Form, Button, Modal } from 'react-bootstrap';

import { icono_B64_1, icono_B64_2, icono_B64_3, icono_B64_4, icono_B64_5 } from '../Imagenes/IconosBase64';

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

const PersonalizarCuenta = () => {
  const navigate = useNavigate();
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [apodo, setApodo] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [pais, setPais] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [userIcon, setUserIcon] = useState('');

  useEffect(() => {
    obtenerDatosUsuario();
  }, []);

  const obtenerDatosUsuario = () => {
    const user = firebase.auth().currentUser;
    const db = firebase.firestore();
  
    if (user) {
      const userInfoCollection = db.collection('info-usuario');
      const userInfoDocument = userInfoCollection.doc('datos');
  
      userInfoDocument
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            const userData = snapshot.data();
            const datos = userData.datos || [];
            const datosUsuario = datos.find((dato) => dato.uid === user.uid);
  
            if (datosUsuario) {
              setNombreCompleto(datosUsuario.nombreCompleto || '');
              setApodo(datosUsuario.apodo || '');
              setEdad(datosUsuario.edad || '');
              setSexo(datosUsuario.sexo || '');
              setPais(datosUsuario.pais || '');
              setDescripcion(datosUsuario.descripcion || '');
              setSelectedImage(datosUsuario.imagen || '');
            } else {
              console.log('No se encontraron datos del usuario');
            }
          } else {
            console.log('No se encontró el documento "datos"');
          }
        })
        .catch((error) => {
          console.error('Error al obtener los datos del usuario:', error);
          setError('Se produjo un error al obtener los datos.');
        });
    }
  };
  

  const handleGuardarDatos = (e) => {
    e.preventDefault();
  
    if (!nombreCompleto || !apodo || !edad || !sexo || !pais) {
      setError('Por favor, complete todos los campos.');
      return;
    }
  
    const user = firebase.auth().currentUser;
    const db = firebase.firestore();
  
    if (user) {
      const userInfoCollection = db.collection('info-usuario');
      const userInfoDocument = userInfoCollection.doc('datos');
  
      userInfoDocument
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            const userData = snapshot.data();
            const datos = userData.datos || [];
  
            const datosUsuarioIndex = datos.findIndex((dato) => dato.uid === user.uid);
  
            if (datosUsuarioIndex !== -1) {
              // Usuario ya tiene datos guardados, actualizarlos
              datos[datosUsuarioIndex] = {
                nombreCompleto,
                apodo,
                edad,
                sexo,
                pais,
                descripcion,
                imagen: selectedImage,
                uid: user.uid
              };
            } else {
              // Usuario no tiene datos guardados, agregar nuevos
              datos.push({
                nombreCompleto,
                apodo,
                edad,
                sexo,
                pais,
                descripcion,
                imagen: selectedImage,
                uid: user.uid
              });
            }
  
            userInfoDocument
              .update({ datos })
              .then(() => {
                setExito(true);
                setTimeout(() => {
                  navigate('/');
                }, 2000);
              })
              .catch((error) => {
                console.error('Error al guardar los datos del usuario:', error);
                setError('Se produjo un error al guardar los datos.');
              });
          } else {
            console.log('No se encontró el documento "datos"');
          }
        })
        .catch((error) => {
          console.error('Error al obtener los datos del usuario:', error);
          setError('Se produjo un error al obtener los datos.');
        });
    }
  };
  
  

  const handleCloseModal = () => {
    setError('');
    setExito(false);
    setShowModal(false);
  };

  const handleSelectImage = (imageBase64) => {
    setSelectedImage(imageBase64);
    setShowModal(false);
  };

  const imagen1Base64 = icono_B64_1;
  const imagen2Base64 = icono_B64_2;
  const imagen3Base64 = icono_B64_3;
  const imagen4Base64 = icono_B64_4;
  const imagen5Base64 = icono_B64_5;

  useEffect(() => {
    if (selectedImage) {
      setUserIcon(`data:image/png;base64, ${selectedImage}`);
    }
  }, [selectedImage]);

  return (
    <div>
      <h2 className="text-center text-white">Personalizar Cuenta</h2>
      {userIcon && (
        <div className="text-center">
          <img src={userIcon} alt="Ícono actual del usuario" />
        </div>
      )}
      <Form onSubmit={handleGuardarDatos} className="text-white">
        <Form.Group controlId="formNombreCompleto" className="mb-3 mt-2">
          <Form.Label>Nombre Completo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese su nombre completo"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            required
            className="bg-dark text-white"
          />
        </Form.Group>
        <Form.Group controlId="formApodo" className="mb-3">
          <Form.Label>Apodo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese su apodo"
            value={apodo}
            onChange={(e) => setApodo(e.target.value)}
            required
            className="bg-dark text-white"
          />
        </Form.Group>
        <Form.Group controlId="formEdad" className="mb-3">
          <Form.Label>Edad</Form.Label>
          <Form.Select
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            required
            className="bg-dark text-white"
          >
            <option value="">Seleccione su edad</option>
            {Array.from({ length: 99 }, (_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="formSexo" className="mb-3">
          <Form.Label>Sexo</Form.Label>
          <Form.Select
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            required
            className="bg-dark text-white"
          >
            <option value="">Seleccione su sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="formPais" className="mb-3">
          <Form.Label>País</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese su país"
            value={pais}
            onChange={(e) => setPais(e.target.value)}
            required
            className="bg-dark text-white"
          />
        </Form.Group>
        <Form.Group controlId="formDescripcion" className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Ingrese una descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="bg-dark text-white"
          />
        </Form.Group>
        <Button variant="secondary me-2" onClick={() => setShowModal(true)}>
          Seleccionar Imagen
        </Button>
        <Button variant="primary" type="submit">
          Guardar Datos
        </Button>
      </Form>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Seleccione una imagen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="d-flex flex-wrap justify-content-center">
            <div className="icono mx-2 my-2" onClick={() => handleSelectImage(imagen1Base64)}>
              <img src={`data:image/png;base64, ${imagen1Base64}`} alt="Icono 1" />
            </div>
            <div className="icono mx-2 my-2" onClick={() => handleSelectImage(imagen2Base64)}>
              <img src={`data:image/png;base64, ${imagen2Base64}`} alt="Icono 2" />
            </div>
            <div className="icono mx-2 my-2" onClick={() => handleSelectImage(imagen3Base64)}>
              <img src={`data:image/png;base64, ${imagen3Base64}`} alt="Icono 3" />
            </div>
            <div className="icono mx-2 my-2" onClick={() => handleSelectImage(imagen4Base64)}>
              <img src={`data:image/png;base64, ${imagen4Base64}`} alt="Icono 4" />
            </div>
            <div className="icono mx-2 my-2" onClick={() => handleSelectImage(imagen5Base64)}>
              <img src={`data:image/png;base64, ${imagen5Base64}`} alt="Icono 5" />
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={error !== '' || exito} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{exito ? '¡Éxito!' : 'Error'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {exito ? (
            <p>Los datos se guardaron correctamente.</p>
          ) : (
            <p>{error}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PersonalizarCuenta;