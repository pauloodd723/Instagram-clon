// Importa la clase base que contiene la estructura y funcionalidades comunes para todos los tipos de publicaciones
import { BasePostModule } from './BasePostModule.js';

// Clase que representa un módulo de publicación de tipo video
// Hereda de BasePostModule para reutilizar la estructura base de un post
export class VideoPostModule extends BasePostModule {
    // Método que genera el contenido HTML específico para una publicación de video
    getMediaHTML() {
        // Retorna una plantilla HTML con un elemento <video> configurado
        return `
            <video width="100%" controls preload="metadata" poster="https://via.placeholder.com/600x400.png?text=Video+Placeholder">
                <!-- Fuente del video, obtenida desde los datos del post -->
                <source src="${this.data.url}" type="video/mp4">
                <!-- Mensaje mostrado si el navegador no soporta el elemento de video -->
                Tu navegador no soporta el tag de video.
            </video>
        `;
    }
}
