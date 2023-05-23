// Axios se utiliza para realizar la solicitud HTTP
import axios from 'axios';

// Clave de la API Key
const API_KEY = '7e7a5dfc44d92090d322e49610a9e8ba';

// Funcion para el acceso a la API
export const APIPeliculasPopulares = async () => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
    );
    return response.data.results;
  } catch (error) {
    console.error('Error al obtener las películas:', error);
    return [];
  }
};