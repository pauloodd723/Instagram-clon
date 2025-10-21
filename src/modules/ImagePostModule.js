// Importa la clase base que contiene la estructura y métodos comunes para todos los tipos de publicaciones
import { BasePostModule } from './BasePostModule.js';

/**
 * Clase que representa un módulo de publicación de imagen.
 * Extiende la funcionalidad base de `BasePostModule` y añade el soporte para mostrar una sola imagen.
 */
export class ImagePostModule extends BasePostModule {

    /**
     * Genera el HTML del contenido multimedia (una imagen).
     * Se usa la URL y el texto alternativo almacenados en los datos de la publicación.
     * 
     * @returns {string} - Código HTML con la imagen renderizada.
     */
    getMediaHTML() {
        return `
            <img 
                src="${this.data.url}" 
                alt="${this.data.caption}" 
                loading="lazy"
                style="width: 100%; border-radius: 10px;"
            >
        `;
    }
}
