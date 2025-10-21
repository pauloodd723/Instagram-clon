// Importa el NotificationManager (patrón Observer) para permitir la comunicación global de eventos
import { notificationManager } from '../patterns/NotificationManager.js';

/**
 * 📦 Clase BasePostModule
 * 
 * Representa la clase base para todos los tipos de publicaciones.
 * Define la estructura y la lógica general de interacción:
 * - Dar "me gusta"
 * - Comentar
 * - Compartir
 * - Mostrar/Ocultar comentarios
 * 
 * Las subclases (ImagePostModule, VideoPostModule, GalleryPostModule, etc.)
 * deben sobrescribir el método `getMediaHTML()` para definir su propio contenido multimedia.
 */
export class BasePostModule {
    /**
     * Crea una nueva instancia de un post.
     * 
     * @param {Object} data - Datos asociados a la publicación.
     * @param {string} data.id - Identificador único del post.
     * @param {string} data.author - Nombre del autor del post.
     * @param {string} data.caption - Texto o descripción del post.
     * @param {number} [data.likes=0] - Cantidad inicial de "me gusta".
     * @param {Array} [data.comments=[]] - Lista de comentarios.
     */
    constructor(data) {
        this.data = { 
            ...data, 
            likes: data.likes || 0,       // Si no hay likes definidos, inicia en 0
            comments: data.comments || [] // Array vacío por defecto
        };

        this.id = data.id; // Guarda el identificador único del post
    }

    /**
     * Método abstracto que debe ser implementado por cada subclase.
     * Define cómo se mostrará el contenido multimedia del post.
     * 
     * @throws {Error} Si no se sobrescribe en la subclase.
     */
    getMediaHTML() {
        throw new Error("El método getMediaHTML() debe ser implementado por la subclase.");
    }

    // =====================================================
    // 🔹 MÉTODOS DE INTERACCIÓN (LÓGICA PRINCIPAL)
    // =====================================================

    /**
     * Maneja el evento de "Me gusta".
     * Incrementa el contador de likes, notifica a otros componentes
     * mediante el patrón Observer, y actualiza la interfaz.
     */
    _handleLike = () => {
        this.data.likes++;

        // Notifica a todos los suscriptores del evento "likes"
        notificationManager.notify('likes', { 
            postId: this.id, 
            author: this.data.author,
            newLikeCount: this.data.likes 
        });

        // Actualiza el contador visual de likes en el DOM
        const likeCounter = document.getElementById(`likes-counter-${this.id}`);
        if (likeCounter) {
            likeCounter.textContent = `${this.data.likes} Me gusta`;
        }
    }

    /**
     * Maneja la acción de comentar un post.
     * Solicita al usuario escribir un comentario, lo guarda,
     * actualiza la interfaz y notifica globalmente.
     */
    _handleComment = () => {
        const commentText = prompt(`Comentar en la publicación de ${this.data.author}:`);

        if (commentText && commentText.trim() !== "") {
            const newComment = { 
                user: "Freddy777", 
                text: commentText.trim(),
                timestamp: new Date().toLocaleTimeString()
            };

            this.data.comments.push(newComment);
            this.updateCommentSection();

            // Notifica a los observadores del evento "comments"
            notificationManager.notify('comments', { 
                postId: this.id, 
                author: this.data.author,
                comment: newComment 
            });
        }
    }

    /**
     * Simula la acción de compartir una publicación por mensaje directo.
     * En un entorno real, esta función podría abrir un modal o enviar una petición al servidor.
     */
    _handleShare = () => {
        alert(`Compartiendo la publicación de ${this.data.author} por mensaje directo (DM). ¡Simulación de envío!`);
    }

    // =====================================================
    // 🔹 MÉTODOS DE INTERFAZ (UI LOCAL)
    // =====================================================

    /**
     * Alterna la visibilidad de la sección de comentarios.
     * También actualiza el texto del botón entre "Ver" y "Ocultar".
     * 
     * @param {string} postId - ID del post a modificar.
     */
    _toggleComments = (postId) => {
        const commentsSection = document.getElementById(`comments-section-${postId}`);
        const button = document.getElementById(`toggle-comments-btn-${postId}`);

        if (commentsSection) {
            const isHidden = commentsSection.classList.toggle('hidden');
            
            if (button) {
                button.textContent = isHidden
                    ? `Ver ${this.data.comments.length} comentarios`
                    : `Ocultar comentarios`;
            }
        }
    }

    /**
     * Actualiza el contenido visual de los comentarios y del caption.
     * Renderiza el último comentario debajo del caption y muestra todos en la lista.
     */
    updateCommentSection() {
        const commentContainer = document.getElementById(`comments-section-${this.id}`);
        const captionContainer = document.getElementById(`caption-container-${this.id}`);
        const toggleButton = document.getElementById(`toggle-comments-btn-${this.id}`);

        if (!commentContainer || !captionContainer || !toggleButton) return;
        
        // --- Muestra el caption y el último comentario (vista previa) ---
        if (this.data.comments.length > 0) {
            const lastComment = this.data.comments[this.data.comments.length - 1];
            captionContainer.innerHTML = `
                <p class="post-caption"><strong>${this.data.author}:</strong> ${this.data.caption}</p>
                <p class="post-comment-preview"><strong>${lastComment.user}:</strong> ${lastComment.text}</p>
            `;
        } else {
            captionContainer.innerHTML = `
                <p class="post-caption"><strong>${this.data.author}:</strong> ${this.data.caption}</p>
            `;
        }

        // --- Renderiza todos los comentarios completos ---
        const allCommentsHTML = this.data.comments.map(c => `
            <p class="full-comment">
                <strong>${c.user}:</strong> ${c.text} <span>(${c.timestamp})</span>
            </p>
        `).join('');

        commentContainer.innerHTML = `<div class="comment-list">${allCommentsHTML}</div>`;
        
        // --- Actualiza el botón ---
        toggleButton.textContent = `Ver ${this.data.comments.length} comentarios`;
        toggleButton.style.display = this.data.comments.length > 0 ? 'block' : 'none';
    }
    
    /**
     * Renderiza el post completo dentro del contenedor indicado.
     * Crea el HTML base, agrega eventos y sincroniza la interfaz inicial.
     * 
     * @param {HTMLElement} container - Elemento HTML donde se renderizará el post.
     */
    render(container) {
        const postElement = document.createElement('div');
        postElement.className = 'post-module';

        // Estructura principal del post
        postElement.innerHTML = `
            <div class="post-header">${this.data.author}</div>

            <div class="post-media">${this.getMediaHTML()}</div>

            <div class="post-actions">
                <button id="like-btn-${this.id}" class="action-btn">❤️</button>
                <button id="comment-btn-modal-${this.id}" class="action-btn">💬</button>
                <button id="dm-btn-${this.id}" class="action-btn">✉️</button>
                <span id="likes-counter-${this.id}" style="margin-left: 10px;">
                    ${this.data.likes} Me gusta
                </span>
            </div>

            <div id="caption-container-${this.id}"></div>
            
            <button class="view-all-btn" id="toggle-comments-btn-${this.id}">
                Ver 0 comentarios
            </button>
            
            <div id="comments-section-${this.id}" class="full-comments hidden"></div>
        `;

        // Añade el post al contenedor
        container.appendChild(postElement);

        // Asigna los manejadores de eventos
        postElement.querySelector(`#like-btn-${this.id}`).addEventListener('click', this._handleLike);
        postElement.querySelector(`#comment-btn-modal-${this.id}`).addEventListener('click', this._handleComment);
        postElement.querySelector(`#toggle-comments-btn-${this.id}`).addEventListener('click', () => this._toggleComments(this.id));
        postElement.querySelector(`#dm-btn-${this.id}`).addEventListener('click', this._handleShare);

        // Renderiza los comentarios iniciales
        this.updateCommentSection();
    }
}
