import { ImagePostModule } from '../modules/ImagePostModule.js';
import { VideoPostModule } from '../modules/VideoPostModule.js';
import { GalleryPostModule } from '../modules/GalleryPostModule.js'; // NUEVO

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
            case 'gallery': // NUEVO: Para carruseles
                return new GalleryPostModule(data);
            default:
                throw new Error(`Tipo de post desconocido: ${type}`);
        }
    }
};