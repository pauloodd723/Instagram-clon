import { BasePostModule } from './BasePostModule.js';

export class GalleryPostModule extends BasePostModule {
    constructor(data) {
        super(data);
        if (!Array.isArray(this.data.urls) || this.data.urls.length < 2) {
             console.error("GalleryPostModule requiere al menos dos URLs.");
             // Fallback: si no hay suficientes URLs, forzamos un array para evitar errores de bucle
             this.data.urls = this.data.urls || ['https://via.placeholder.com/600x600.png?text=Error'];
        }
        this.currentIndex = 0;
    }

    _handleNext = () => {
        // Usa el módulo para asegurar que el índice no supere el tamaño del array.
        this.currentIndex = (this.currentIndex + 1) % this.data.urls.length;
        this._updateMediaUI();
    }

    _handlePrev = () => {
        // Maneja el retorno al último índice cuando se pasa del 0.
        this.currentIndex = (this.currentIndex - 1 + this.data.urls.length) % this.data.urls.length;
        this._updateMediaUI();
    }
    
    _updateMediaUI = () => {
        const mediaContainer = document.getElementById(`media-content-${this.id}`);
        const dotsContainer = document.getElementById(`dots-container-${this.id}`);
        
        if (mediaContainer) {
            mediaContainer.src = this.data.urls[this.currentIndex];
        }
        
        if (dotsContainer) {
            // Actualizar la clase del punto activo
            Array.from(dotsContainer.children).forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }
        
        // Opcional: Para el debug, muestra el índice actual en consola.
        console.log(`Post ${this.id}: Carrusel movido a índice ${this.currentIndex}`);
    }

    getMediaHTML() {
        // Se asegura que solo se creen tantos puntos como URLs haya.
        const dots = this.data.urls.map((_, index) => 
            `<span class="dot ${index === 0 ? 'active' : ''}"></span>`
        ).join('');

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
    
    render(container) {
        super.render(container); 
        
        const postElement = container.lastElementChild;
        
        const prevButton = postElement.querySelector(`#prev-btn-${this.id}`);
        const nextButton = postElement.querySelector(`#next-btn-${this.id}`);
        
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', this._handlePrev);
            nextButton.addEventListener('click', this._handleNext);
        }
        
        // Es importante que el post de Galería sepa que debe tener sus botones de navegación.
        // Si el carrusel tiene 1 o menos imágenes, los botones no deberían hacer nada (la validación de array lo maneja).
    }
}