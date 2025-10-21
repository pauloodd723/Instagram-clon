// Importa la clase base que define la estructura común para los módulos de publicación
import { BasePostModule } from './BasePostModule.js';

/**
 * Clase que representa un módulo de publicación de video.
 * Hereda la estructura general desde `BasePostModule`, pero sobrescribe el método para mostrar un video.
 */
export class VideoPostModule extends BasePostModule {

    /**
     * Genera el HTML del contenido multimedia (un video).
     * Incluye controles, previsualización (poster) y un mensaje alternativo
     * en caso de que el navegador no soporte el elemento <video>.
     * 
     * @returns {string} - Código HTML que muestra el video dentro del post.
     */
    getMediaHTML() {
        return `
            <video 
                width="100%" 
                controls 
                preload="metadata" 
                poster="https://via.placeholder.com/600x400.png?text=Video+Placeholder"
                style="border-radius: 10px;"
            >
                <source src="${this.data.url}" type="video/mp4">
                Tu navegador no soporta el elemento de video.
            </video>
        `;
    }
}
