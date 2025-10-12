import { ImagePostModule } from '../modules/ImagePostModule.js';
import { VideoPostModule } from '../modules/VideoPostModule.js';

/**
 * PostFactory (Factory): Una fábrica que crea instancias específicas de publicaciones.
 */
export const PostFactory = {
    createPost(type, data) {
        switch (type) {
            case 'image':
                return new ImagePostModule(data);
            case 'video':
                return new VideoPostModule(data);
            // case 'gallery':
            //     // Implementar aquí la clase GalleryPostModule
            default:
                throw new Error(`Tipo de post desconocido: ${type}`);
        }
    }
};