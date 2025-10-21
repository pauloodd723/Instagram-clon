// Importa la clase base que contiene la estructura y funcionalidades comunes para todos los tipos de publicaciones
import { BasePostModule } from './BasePostModule.js';

// Clase que representa un módulo de publicación tipo galería (carrusel de imágenes)
// Hereda de BasePostModule para mantener la estructura base de las publicaciones
export class GalleryPostModule extends BasePostModule {
    constructor(data) {
        // Llama al constructor de la clase base
        super(data);
        // Verifica que las URLs proporcionadas sean un arreglo con al menos dos elementos
        if (!Array.isArray(this.data.urls) || this.data.urls.length < 2) {
            console.error("GalleryPostModule requiere al menos dos URLs.");
            // Si no hay suficientes URLs, se asigna una imagen por defecto para evitar errores
            this.data.urls = this.data.urls || ['https://via.placeholder.com/600x600.png?text=Error'];
        }
        // Inicializa el índice actual del carrusel en 0
        this.currentIndex = 0;
    }

    // Método que maneja el cambio al siguiente elemento del carrusel
    _handleNext = () => {
        // Incrementa el índice y vuelve al inicio si llega al final del arreglo
        this.currentIndex = (this.currentIndex + 1) % this.data.urls.length;
        // Actualiza la interfaz del carrusel
        this._updateMediaUI();
    }

    // Método que maneja el cambio al elemento anterior del carrusel
    _handlePrev = () => {
        // Decrementa el índice y vuelve al final si se pasa del primer elemento
        this.currentIndex = (this.currentIndex - 1 + this.data.urls.length) % this.data.urls.length;
        // Actualiza la interfaz del carrusel
        this._updateMediaUI();
    }
    
    // Método que actualiza la imagen visible y los indicadores (puntos)
    _updateMediaUI = () => {
        // Obtiene los elementos del DOM asociados a este post
        const mediaContainer = document.getElementById(`media-content-${this.id}`);
        const dotsContainer = document.getElementById(`dots-container-${this.id}`);
        
        // Actualiza la imagen mostrada
        if (mediaContainer) {
            mediaContainer.src = this.data.urls[this.currentIndex];
        }
        
        // Actualiza el estado visual de los puntos (indicadores)
        if (dotsContainer) {
            Array.from(dotsContainer.children).forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }
        
        // Muestra en consola el índice actual (para depuración)
        console.log(`Post ${this.id}: Carrusel movido a índice ${this.currentIndex}`);
    }

    // Método que devuelve el HTML del carrusel de imágenes
    getMediaHTML() {
        // Genera los puntos indicadores según la cantidad de imágenes
        const dots = this.data.urls.map((_, index) => 
            `<span class="dot ${index === 0 ? 'active' : ''}"></span>`
        ).join('');

        // Retorna el contenido HTML del carrusel
        return `
            <div class="carousel-container">
                <img id="media-content-${this.id}" src="${this.data.urls[this.currentIndex]}" alt="Galería ${this.id}">
                
                <button class="prev-btn" id="prev-btn-${this.id}">&#10094;</button>
                <button class="next-btn" id="next-btn-${this.id}">&#10095;</button>
                
                <div class="dots-container" id="dots-container-${this.id}">
                    ${dots}
                </div>
            </div>
        `;
    }
    
    // Método que renderiza el post y agrega los eventos de los botones de navegación
    render(container) {
        // Llama al método de renderizado de la clase base
        super.render(container); 
        
        // Obtiene el último elemento del contenedor (el post recién agregado)
        const postElement = container.lastElementChild;
        
        // Obtiene los botones de navegación del carrusel
        const prevButton = postElement.querySelector(`#prev-btn-${this.id}`);
        const nextButton = postElement.querySelector(`#next-btn-${this.id}`);
        
        // Asigna los eventos a los botones si existen
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', this._handlePrev);
            nextButton.addEventListener('click', this._handleNext);
        }
        
        // Nota: si el carrusel tiene 1 o menos imágenes, los botones no realizarán acciones.
    }
}
