// Importa la clase base para heredar su funcionalidad (likes, comentarios, compartir, etc.)
import { BasePostModule } from './BasePostModule.js';

/**
 * GalleryPostModule:
 * Extiende la clase BasePostModule para manejar publicaciones que contienen
 * múltiples imágenes (una galería o carrusel).
 * 
 * Agrega controles de navegación (anterior/siguiente) y puntos indicadores.
 */
export class GalleryPostModule extends BasePostModule {
    constructor(data) {
        // Llama al constructor de la clase padre
        super(data);

        // Validación: asegúrate de que 'urls' sea un arreglo con al menos dos imágenes
        if (!Array.isArray(this.data.urls) || this.data.urls.length < 2) {
             console.error("GalleryPostModule requiere al menos dos URLs.");
             // En caso de error, usa una imagen por defecto para evitar fallos en el carrusel
             this.data.urls = this.data.urls || ['https://via.placeholder.com/600x600.png?text=Error'];
        }

        // Índice actual de la imagen mostrada en el carrusel
        this.currentIndex = 0;
    }

    // Maneja el evento del botón "siguiente"
    _handleNext = () => {
        // Incrementa el índice y vuelve al inicio si se llega al final del array (carrusel circular)
        this.currentIndex = (this.currentIndex + 1) % this.data.urls.length;
        // Actualiza la interfaz visual del carrusel
        this._updateMediaUI();
    }

    // Maneja el evento del botón "anterior"
    _handlePrev = () => {
        // Decrementa el índice y vuelve al último elemento si se pasa de 0
        this.currentIndex = (this.currentIndex - 1 + this.data.urls.length) % this.data.urls.length;
        // Actualiza la interfaz visual del carrusel
        this._updateMediaUI();
    }
    
    // Actualiza dinámicamente la imagen mostrada y los puntos indicadores
    _updateMediaUI = () => {
        // Obtiene los elementos del DOM asociados a la imagen y los puntos
        const mediaContainer = document.getElementById(`media-content-${this.id}`);
        const dotsContainer = document.getElementById(`dots-container-${this.id}`);
        
        // Actualiza la imagen actual del carrusel
        if (mediaContainer) {
            mediaContainer.src = this.data.urls[this.currentIndex];
        }
        
        // Actualiza el estado visual de los puntos (dot activo)
        if (dotsContainer) {
            Array.from(dotsContainer.children).forEach((dot, index) => {
                // Añade o quita la clase 'active' dependiendo del índice actual
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }
        
        // Muestra el índice actual en la consola (solo para depuración)
        console.log(`Post ${this.id}: Carrusel movido a índice ${this.currentIndex}`);
    }

    // Devuelve el HTML del contenido multimedia de la publicación (el carrusel)
    getMediaHTML() {
        // Crea un punto (dot) por cada imagen, marcando el primero como activo
        const dots = this.data.urls.map((_, index) => 
            `<span class="dot ${index === 0 ? 'active' : ''}"></span>`
        ).join('');

        // Estructura principal del carrusel:
        // - Imagen actual
        // - Botones de navegación
        // - Indicadores (puntos)
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
    
    // Renderiza la publicación de galería completa dentro del contenedor dado
    render(container) {
        // Llama al método render de la clase padre para construir la estructura base del post
        super.render(container); 
        
        // Obtiene el último elemento agregado al contenedor (el post recién renderizado)
        const postElement = container.lastElementChild;
        
        // Busca los botones de navegación (prev y next)
        const prevButton = postElement.querySelector(`#prev-btn-${this.id}`);
        const nextButton = postElement.querySelector(`#next-btn-${this.id}`);
        
        // Si los botones existen, asigna los eventos de clic correspondientes
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', this._handlePrev);
            nextButton.addEventListener('click', this._handleNext);
        }
        
        // Nota: Si el carrusel tiene 1 o menos imágenes, los botones no hacen nada.
        // Esto ya está validado en el constructor, por lo que no causará errores.
    }
}
