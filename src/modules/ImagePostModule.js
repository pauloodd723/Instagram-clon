// Importa la clase base que contiene la estructura y funcionalidades comunes para todos los tipos de publicaciones
import { BasePostModule } from './BasePostModule.js';

// Clase que representa un módulo de publicación de tipo imagen
// Hereda de BasePostModule para aprovechar la lógica base de las publicaciones
export class ImagePostModule extends BasePostModule {
    // Método que genera el contenido HTML específico para una publicación de imagen
    getMediaHTML() {
        // Retorna una etiqueta <img> con la URL y el texto alternativo definidos en los datos del post
        return `<img src="${this.data.url}" alt="${this.data.caption}">`;
    }
}
