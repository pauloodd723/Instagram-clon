// Importa la fábrica de publicaciones para crear los diferentes tipos de posts
import { PostFactory } from './PostFactory.js';

/**
 * FeedManager (Singleton): Se encarga de gestionar el estado y el renderizado del feed principal.
 * Utiliza el patrón Singleton para asegurar que solo exista una instancia de esta clase.
 */
class FeedManager {
    // Propiedad privada estática que almacenará la instancia única del Singleton
    static #instance;
    // Arreglo privado donde se almacenan los datos (posts) del feed
    #feedData = []; 

    // Constructor de la clase
    constructor() {
        // Si ya existe una instancia de FeedManager, devuelve esa misma
        if (FeedManager.#instance) {
            return FeedManager.#instance;
        }
        // Si no existe, guarda esta como la instancia única
        FeedManager.#instance = this;
    }

    // Método estático que retorna la instancia única de FeedManager
    static getInstance() {
        // Si aún no se ha creado, la instancia se crea aquí
        if (!this.#instance) {
            this.#instance = new FeedManager();
        }
        // Retorna siempre la misma instancia
        return this.#instance;
    }

    // Método para agregar una nueva publicación al feed
    addPost(type, data) {
        // Crea una instancia del post según su tipo usando la fábrica
        const postModule = PostFactory.createPost(type, data); 
        // Agrega el nuevo post al arreglo del feed
        this.#feedData.push(postModule);
        // Llama al método para renderizar el feed actualizado
        this.render();
    }

    // Método encargado de renderizar el contenido del feed en el DOM
    render() {
        // Busca el contenedor del feed en el documento
        const container = document.getElementById('feed-container'); 
        // Verifica si el contenedor existe antes de intentar renderizar
        if (!container) {
            console.error("El contenedor 'feed-container' NO fue encontrado en el DOM durante el renderizado.");
            return;
        }

        // Limpia el contenido anterior del contenedor
        container.innerHTML = '';
        // Recorre cada post almacenado y lo renderiza dentro del contenedor
        this.#feedData.forEach(postModule => {
            postModule.render(container); 
        });
        // Muestra en consola la cantidad de posts renderizados
        console.log(`[Singleton] Renderizado completado con ${this.#feedData.length} posts.`);
    }
}

// Crea y exporta una única instancia de FeedManager (Singleton)
export const feedManager = FeedManager.getInstance();
