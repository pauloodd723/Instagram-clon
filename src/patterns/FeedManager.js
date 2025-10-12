import { PostFactory } from './PostFactory.js';

/**
 * FeedManager (Singleton): Gestiona el estado y la renderización del feed principal.
 */
class FeedManager {
    static #instance;
    #feedData = []; 

    constructor() {
        if (FeedManager.#instance) {
            return FeedManager.#instance;
        }
        FeedManager.#instance = this;
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new FeedManager();
        }
        return this.#instance;
    }

    addPost(type, data) {
        const postModule = PostFactory.createPost(type, data); 
        this.#feedData.push(postModule);
        this.render();
    }

    render() {
        // Busca el contenedor en el momento del renderizado (corrección del error de sincronización)
        const container = document.getElementById('feed-container'); 
        if (!container) {
            console.error("El contenedor 'feed-container' NO fue encontrado en el DOM durante el renderizado.");
            return;
        }

        container.innerHTML = '';
        this.#feedData.forEach(postModule => {
            postModule.render(container); 
        });
        console.log(`[Singleton] Renderizado completado con ${this.#feedData.length} posts.`);
    }
}

export const feedManager = FeedManager.getInstance();