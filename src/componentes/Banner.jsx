import React from 'react';
// Componentes para los estilos
import { Container, Col} from 'react-bootstrap';

// Componente para la imagen
import { bannerBase64 } from './ImagenBase64';

const Banner = () => {
  const banner = bannerBase64;
  return (
    <div className="py-2 text-center">
      <Container>
        <Col md={10} className="mx-auto d-flex justify-content-center align-items-center">
          <img src={`data:image/png;base64, ${banner}`} alt="Logo del desarrollador" 
          className="img-fluid w-auto" />
        </Col>
      </Container>
    </div>
  );
};

export default Banner;
