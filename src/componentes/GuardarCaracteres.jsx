import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from './firebaseConfig';

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

const GuardarCaracteres = () => {
  const [caracteres, setCaracteres] = useState('');

  const handleCaracteresChange = (event) => {
    setCaracteres(event.target.value);
  };

  const handleGuardarCaracteres = () => {
    const user = firebase.auth().currentUser;

    if (user) {
      const db = firebase.firestore();
      const userCollection = db.collection(user.uid);
      const caracteresDocument = userCollection.doc('caracteres');

      caracteresDocument.update({ [caracteres]: true }).then(() => {
        console.log('Caracter agregado:', caracteres);
      }).catch((error) => {
        console.error('Error al agregar el caracter:', error);
      });
    }
  };

  return (
    <div>
      <h2>Guardar caracteres</h2>
      <input type="text" value={caracteres} onChange={handleCaracteresChange} />
      <button onClick={handleGuardarCaracteres}>Guardar</button>
    </div>
  );
};

export default GuardarCaracteres;
