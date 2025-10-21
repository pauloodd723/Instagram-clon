// Importa el módulo para manejar publicaciones con imágenes
import { ImagePostModule } from '../modules/ImagePostModule.js';
// Importa el módulo para manejar publicaciones con videos
import { VideoPostModule } from '../modules/VideoPostModule.js';
// Importa el módulo para manejar publicaciones tipo galería (carrusel)
import { GalleryPostModule } from '../modules/GalleryPostModule.js'; // NUEVO

// Objeto PostFactory que actúa como una fábrica para crear diferentes tipos de publicaciones
export const PostFactory = {
    // Método que crea una publicación según el tipo especificado
    createPost(type, data) {
        // Estructura de control para determinar qué tipo de publicación crear
        switch (type) {
            case 'image': // Si el tipo es 'image'
                return new ImagePostModule(data); // Crea una instancia del módulo de imagen
            case 'video': // Si el tipo es 'video'
                return new VideoPostModule(data); // Crea una instancia del módulo de video
            case 'gallery': // NUEVO: Si el tipo es 'gallery'
                return new GalleryPostModule(data); // Crea una instancia del módulo de galería
            default:
                // Si el tipo no coincide con ninguno, lanza un error
                throw new Error(`Tipo de post desconocido: ${type}`);
        }
    }
};
