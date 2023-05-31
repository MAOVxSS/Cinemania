import React from 'react';
//Mandamos a llamar la libreria que nos va a permitir usar el componente del video 
import ReactPLayer from 'react-player';

//Creamos la fuincion llamada Video para poder mandar llamar nuestro video que 
//ya existe en la carpeta ./componentes/videos y le damos el ancho y el largo que necesitamos 
//claro y le agragamos los controles para poder deterne el video con la funcion controls
function Video() {
  return (
    <div className='Video' style={{ width: '100', height: '80%', justifyContent: 'flex-end', position: 'static' }}>
      <ReactPLayer
        url={require('../Imagenes/videos/video2.mp4')}
        width='100%'
        height='80%'
        controls

      />
    </div>
  );
}
export default Video;