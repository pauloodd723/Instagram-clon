// Importa los diferentes tipos de módulos de publicación disponibles.
import { ImagePostModule } from '../modules/ImagePostModule.js';
import { VideoPostModule } from '../modules/VideoPostModule.js';
import { GalleryPostModule } from '../modules/GalleryPostModule.js'; // NUEVO tipo de post (galería)

/**
 * PostFactory (Patrón Factory)
 * Se encarga de crear instancias del tipo correcto de publicación (imagen, video o galería)
 * según el parámetro 'type' recibido.
 */
export const PostFactory = {
    /**
     * Crea y devuelve una instancia del módulo de publicación correspondiente.
     * @param {string} type - Tipo de publicación ('image', 'video', 'gallery', etc.)
     * @param {object} data - Datos del post (autor, url, caption, likes, etc.)
     * @returns {BasePostModule} - Una instancia del módulo adecuado.
     */
    createPost(type, data) {
        switch (type) {
            // Si el tipo es 'image', crea un post de imagen.
            case 'image':
                return new ImagePostModule(data);

            // Si el tipo es 'video', crea un post de video.
            case 'video':
                return new VideoPostModule(data);

            // Si el tipo es 'gallery', crea un post tipo carrusel (múltiples imágenes o videos).
            case 'gallery': // NUEVO tipo de publicación
                return new GalleryPostModule(data);

            // Si el tipo no coincide con ninguno, lanza un error.
            default:
                throw new Error(`Tipo de post desconocido: ${type}`);
        }
    }
};
