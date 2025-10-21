// Importa la fábrica de publicaciones (PostFactory), 
// responsable de crear instancias específicas de posts (imagen, video, galería, etc.)
import { PostFactory } from './PostFactory.js';

/**
 * 🧩 Clase FeedManager
 * 
 * Patrón de diseño: **Singleton**
 * 
 * Esta clase gestiona el estado global del *feed principal* de publicaciones.
 * Se asegura de que solo exista una instancia en toda la aplicación, encargada de:
 * 
 * - Almacenar todos los módulos de publicaciones.
 * - Crear nuevas publicaciones mediante `PostFactory`.
 * - Renderizar dinámicamente el contenido del feed en el DOM.
 * 
 * Su objetivo es mantener el control centralizado del flujo del contenido del usuario.
 */
class FeedManager {
    // --- Propiedades privadas (encapsuladas con #) ---
    static #instance;      // Instancia única del Singleton
    #feedData = [];        // Arreglo que contiene los módulos de publicaciones actuales

    /**
     * Constructor privado.
     * Si ya existe una instancia previa, retorna esa misma referencia.
     * Esto asegura la existencia de un único FeedManager activo.
     */
    constructor() {
        if (FeedManager.#instance) {
            return FeedManager.#instance;
        }
        FeedManager.#instance = this;
    }

    /**
     * Obtiene la instancia única del FeedManager.
     * Si no existe, la crea por primera vez.
     * 
     * @returns {FeedManager} Instancia única del administrador del feed.
     */
    static getInstance() {
        if (!this.#instance) {
            this.#instance = new FeedManager();
        }
        return this.#instance;
    }

    /**
     * Agrega una nueva publicación al feed.
     * Utiliza la fábrica `PostFactory` para crear el tipo correcto de módulo.
     * 
     * @param {string} type - Tipo de publicación (por ejemplo: "image", "video", "gallery").
     * @param {Object} data - Datos específicos del post (autor, url, caption, etc.).
     */
    addPost(type, data) {
        const postModule = PostFactory.createPost(type, data); // Crea el módulo adecuado
        this.#feedData.push(postModule);                       // Lo agrega al arreglo global
        this.render();                                         // Actualiza visualmente el feed
    }

    /**
     * Renderiza todos los posts en el contenedor principal del feed.
     * Si el contenedor no existe en el DOM, lanza un error controlado.
     * 
     * Este método es llamado automáticamente cada vez que se agrega una nueva publicación.
     */
    render() {
        // Se obtiene dinámicamente el contenedor principal del feed
        const container = document.getElementById('feed-container'); 

        // Validación: Si el contenedor no existe, se detiene el renderizado
        if (!container) {
            console.error("El contenedor 'feed-container' NO fue encontrado en el DOM durante el renderizado.");
            return;
        }

        // Limpia el contenido previo del feed
        container.innerHTML = '';

        // Recorre todas las publicaciones almacenadas y las renderiza en orden
        this.#feedData.forEach(postModule => {
            postModule.render(container);
        });

        // Mensaje de depuración informativo
        console.log(`[Singleton] Renderizado completado con ${this.#feedData.length} posts.`);
    }
}

// Exporta una única instancia del FeedManager (patrón Singleton)
export const feedManager = FeedManager.getInstance();
