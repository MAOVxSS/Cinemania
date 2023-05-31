import React, { useEffect, useState } from 'react';
// Estilos
import { Dropdown } from 'react-bootstrap';
// Para acceso a firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const Compartir = ({ peliculaId }) => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // Obtener la lista de usuarios disponibles
  const obtenerUsuarios = async () => {
    try {
      const db = firebase.firestore();
      const usuariosSnapshot = await db.collection('info-usuario').doc('datos').get();
      if (usuariosSnapshot.exists) {
        const usuariosData = usuariosSnapshot.data().datos || [];
        
        // Filtrar los usuarios para excluir el usuario actual
        const usuariosFiltrados = usuariosData.filter((usuario) => {
          return usuario.uid !== firebase.auth().currentUser?.uid;
        });
  
        setUsuarios(usuariosFiltrados);
      }
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };

  // Realizar una recomendación a un usuario seleccionado
  const hacerRecomendacion = (uidRecomendado) => {
    const user = firebase.auth().currentUser;
    if (user) {
      const uidRecomendador = user.uid;

      const db = firebase.firestore();
      const recomendacionesRef = db.collection('recomendaciones').doc('datos');

      // Actualizar los datos de recomendaciones en Firestore
      recomendacionesRef.update({
        datos: firebase.firestore.FieldValue.arrayUnion({
          idPelicula: peliculaId,
          uidRecomendado,
          uidRecomendador,
        }),
      })
        .then(() => {
          console.log('Recomendación guardada con éxito');
        })
        .catch((error) => {
          console.error('Error al guardar la recomendación:', error);
        });
    } else {
      console.error('Usuario no autenticado');
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="danger" id="compartir-dropdown">
        Compartir
      </Dropdown.Toggle>
      <Dropdown.Menu className="bg-danger">
        {usuarios.map((usuario) => (
          <Dropdown.Item
            key={usuario.uid}
            href={`#${usuario.apodo}`}
            onClick={() => hacerRecomendacion(usuario.uid)}
          >
            {usuario.apodo}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Compartir;
