import axios from 'axios';

// Clave de la API Key
const API_KEY = '7e7a5dfc44d92090d322e49610a9e8ba';

export const getPopularMovies = async () => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
    );
    return response.data.results;
  } catch (error) {
    console.error('Error al obtener las películas populares:', error);
    return [];
  }
};