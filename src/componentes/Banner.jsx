import React from 'react';
// Componentes para los estilos
import { Container, Col} from 'react-bootstrap';

// Componente para la imagen
import { bannerBase64 } from './ImagenBase64';

const Banner = () => {
  const banner = bannerBase64;
  return (
    <div className="bg-dark py-4">
      <Container>
        <Col md={12} className="mx-auto">
          <img src={`data:image/png;base64, ${banner}`} alt="Logo del desarrollador" className="img-fluid w-100" />
        </Col>
      </Container>
    </div>
  );
};

export default Banner;
