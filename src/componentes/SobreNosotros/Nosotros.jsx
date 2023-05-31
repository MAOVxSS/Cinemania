import React from 'react';

// Importamos nuestro componente del video
import Video from './Video';
import 'bootstrap/dist/css/bootstrap.min.css';

// Creamos la funcion Nosotros , para meter el texto de nuestra aplicacion web y
//Mandamos llamar nuestro componente video 
function Nosotros() {
  return (
    <body>
      <div>
        <h1 className='text-white text-center bg-dark'>CINEMANIA</h1>
        <p className='text-white text-left bg-dark'>Hemos creado Cinemania para ti, esta te acompañara en un camino a la diversión y el entretenimiento.El entretenimiento si costo y de buena calidad es nuestra prioridad, para ofrecerle a nuestros clientes un ambiente seguro y divertido de visitar.</p>
        <h2 className='text-white text-center bg-dark'>MISIÓN</h2>
        <p className='text-white text-left bg-dark' >Cinemania se ha centra en revolucionar la forma en que las personas acceden y disfrutan del entretenimiento, proporcionando una amplia variedad de contenido en línea a través de nuestra plataforma. Su misión es brindar a los espectadores la libertad de elegir qué y cuándo quieren ver, sin tener que depender de horarios de programación tradicionales. Cinemania ha buscado constantemente expandir su biblioteca de contenido y mejorar la experiencia del usuario, ofreciendo recomendaciones y permitiendo la visualización en múltiples dispositivos.</p>
        <h2 className='text-white text-center bg-dark'>OBJETIVO</h2>
        <p className='text-white text-left  bg-dark'>El objetivo principal de Cinemania es convertirse en el principal servicio de entretenimiento por en línea, ofreciendo contenido de alta calidad y una experiencia de usuario excepcional.</p>
        <h1 className='text-white text-center bg-dark'>Que esperas ven y regístrate ahora mismo, no pierdas más tiempo.</h1>
        <Video />
      </div>
    </body>
  );
}
export default Nosotros;