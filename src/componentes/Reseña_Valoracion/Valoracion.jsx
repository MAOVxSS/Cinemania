import React, { useState } from "react";
import { Button } from 'react-bootstrap';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import firebaseConfig from '../firebaseConfig/firebaseConfig';
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function Valoracion({ idPelicula }) {
  const [numero, setNumero] = useState(0);
  const [estrellaHover, setEstrellaHover] = useState(undefined);

  const guardarValoracion = async () => {
    const user = firebase.auth().currentUser;
    if (user && numero > 0) {
      const uid = user.uid;
      const valoracionData = {
        idPelicula: idPelicula || "",
        valor: numero,
        uid
      };
      try {
        const valoracionRef = db.collection("valoracion").doc("datos");
        const doc = await valoracionRef.get();
        if (doc.exists) {
          const valoraciones = doc.data().datos;
          const existingValoracion = valoraciones.find(
            (valoracion) => valoracion.uid === uid && valoracion.idPelicula === idPelicula
          );
          if (existingValoracion) {
            // Actualizar valoración existente
            await valoracionRef.update({
              datos: valoraciones.map((valoracion) =>
                valoracion.uid === uid && valoracion.idPelicula === idPelicula
                  ? valoracionData
                  : valoracion
              )
            });
          } else {
            // Agregar nueva valoración
            await valoracionRef.update({
              datos: firebase.firestore.FieldValue.arrayUnion(valoracionData)
            });
          }
        } else {
          // Agregar nueva valoración
          await valoracionRef.set({
            datos: [valoracionData]
          });
        }
        console.log("Valoración guardada exitosamente");
      } catch (error) {
        console.error("Error al guardar la valoración:", error);
      }
    } else {
      console.error("Usuario no autenticado o valoración inválida.");
    }
  };

  return (
    <div>
      {Array(5)
        .fill()
        .map((_, index) =>
          numero >= index + 1 || estrellaHover >= index + 1 ? (
            <AiFillStar
              onMouseOver={() => !numero && setEstrellaHover(index + 1)}
              onMouseLeave={() => setEstrellaHover(undefined)}
              style={{ color: "orange" }}
              onClick={() => setNumero(index + 1)}
              key={index}
            />
          ) : (
            <AiOutlineStar
              onMouseOver={() => !numero && setEstrellaHover(index + 1)}
              onMouseLeave={() => setEstrellaHover(undefined)}
              style={{ color: "orange" }}
              onClick={() => setNumero(index + 1)}
              key={index}
            />
          )
        )}
      <Button className="me-2" variant="warning" onClick={guardarValoracion}>Guardar Valoración</Button>
    </div>
  );
}

export default Valoracion;
