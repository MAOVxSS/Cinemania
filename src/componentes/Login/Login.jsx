import React, { useState } from 'react';
// acceso a la firestore
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import firebaseConfig from '../../firebaseConfig/firebaseConfig';

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

const Login = () => {
  // Se manejan los estados
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Eventos para manejar el correo y contraseña, para inciar sesion
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // Confirma el inicio de sesión
  const handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Acceso exitoso, puedes redirigir a otra página aquí
        console.log('Inicio de sesión exitoso', userCredential);
      })
      .catch((error) => {
        // Se produjo un error durante el inicio de sesión
        setErrorMessage(error.message);
      });
  };

  return (
    <div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={handleEmailChange} />
      </div>
      <div>
        <label>Contraseña:</label>
        <input type="password" value={password} onChange={handlePasswordChange} />
      </div>
      <div>
        <button onClick={handleLogin}>Iniciar sesión</button>
      </div>
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
};

export default Login;