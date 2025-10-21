// Importa el administrador de notificaciones (patrón Observer) para manejar los eventos de 'likes' y 'comments'
import { notificationManager } from '../patterns/NotificationManager.js';

/**
 * BasePostModule (Módulo base): Clase principal para todas las publicaciones.
 * Contiene la lógica compartida de interacciones (like, comentar, compartir)
 * y la estructura base para el renderizado del contenido.
 */
export class BasePostModule {
    constructor(data) {
        // Inicializa los datos del post, asegurando que tenga likes y un arreglo de comentarios
        this.data = { 
            ...data, 
            likes: data.likes || 0,
            comments: data.comments || [] // Inicializa los comentarios como arreglo vacío
        };
        // Asigna el identificador único del post
        this.id = data.id;
    }

    // Método que deben implementar las subclases (como ImagePostModule o VideoPostModule)
    getMediaHTML() {
        // Si una subclase no lo implementa, lanza un error
        throw new Error("El método getMediaHTML() debe ser implementado por la subclase.");
    }

    // --- LÓGICA DE INTERACCIONES ---

    // Maneja la acción de "Me gusta"
    _handleLike = () => {
        // Incrementa el contador de likes localmente
        this.data.likes++;
        
        // Notifica el evento 'likes' a todos los observadores (patrón Observer)
        notificationManager.notify('likes', { 
            postId: this.id, 
            author: this.data.author,
            newLikeCount: this.data.likes 
        });

        // Actualiza el contador de likes en la interfaz
        const likeCounter = document.getElementById(`likes-counter-${this.id}`);
        if (likeCounter) {
            likeCounter.textContent = `${this.data.likes} Me gusta`;
        }
    }

    // Maneja la acción de comentar en una publicación
    _handleComment = () => {
        // Solicita al usuario que escriba un comentario
        const commentText = prompt(`Comentar en la publicación de ${this.data.author}:`);
        if (commentText && commentText.trim() !== "") {
            // Crea un nuevo comentario
            const newComment = { 
                user: "Freddy777", 
                text: commentText.trim(),
                timestamp: new Date().toLocaleTimeString()
            };
            // Agrega el comentario al arreglo del post
            this.data.comments.push(newComment); 
            // Actualiza la vista de los comentarios
            this.updateCommentSection();

            // Notifica el evento 'comments' a los observadores
            notificationManager.notify('comments', { 
                postId: this.id, 
                author: this.data.author,
                comment: newComment 
            });
        }
    }

    // Simula la acción de compartir un post
    _handleShare = () => {
        alert(`Compartiendo la publicación de ${this.data.author} por mensaje directo (DM). ¡Simulación de envío!`);
    }

    // --- LÓGICA DE INTERFAZ DE USUARIO (UI) LOCAL ---

    // Alterna la visibilidad de la sección de comentarios
    _toggleComments = (postId) => {
        const commentsSection = document.getElementById(`comments-section-${postId}`);
        const button = document.getElementById(`toggle-comments-btn-${postId}`);
        if (commentsSection) {
            const isHidden = commentsSection.classList.toggle('hidden');
            // Cambia el texto del botón según el estado de la sección
            if (button) {
                 button.textContent = isHidden ? 
                    `Ver ${this.data.comments.length} comentarios` : 
                    `Ocultar comentarios`;
            }
        }
    }

    // Actualiza la sección de comentarios en el DOM
    updateCommentSection() {
        const commentContainer = document.getElementById(`comments-section-${this.id}`);
        const captionContainer = document.getElementById(`caption-container-${this.id}`);
        const toggleButton = document.getElementById(`toggle-comments-btn-${this.id}`);

        // Si alguno de los elementos no existe, no hace nada
        if (!commentContainer || !captionContainer || !toggleButton) return;
        
        // Muestra el texto del autor y el último comentario (si existe)
        if (this.data.comments.length > 0) {
            const lastComment = this.data.comments[this.data.comments.length - 1];
            captionContainer.innerHTML = `
                <p class="post-caption"><strong>${this.data.author}:</strong> ${this.data.caption}</p>
                <p class="post-comment-preview"><strong>${lastComment.user}:</strong> ${lastComment.text}</p>
            `;
        } else {
            captionContainer.innerHTML = `<p class="post-caption"><strong>${this.data.author}:</strong> ${this.data.caption}</p>`;
        }

        // Renderiza todos los comentarios en la sección desplegable
        const allCommentsHTML = this.data.comments.map(c => `
            <p class="full-comment"><strong>${c.user}:</strong> ${c.text} <span>(${c.timestamp})</span></p>
        `).join('');

        commentContainer.innerHTML = `<div class="comment-list">${allCommentsHTML}</div>`;
        
        // Actualiza el texto del botón de ver comentarios
        toggleButton.textContent = `Ver ${this.data.comments.length} comentarios`;
        toggleButton.style.display = this.data.comments.length > 0 ? 'block' : 'none';
    }
    
    // Renderiza la publicación completa dentro del contenedor especificado
    render(container) {
        // Crea un nuevo elemento HTML para el post
        const postElement = document.createElement('div');
        postElement.className = 'post-module';
        // Inserta la estructura básica del post con botones e interacciones
        postElement.innerHTML = `
            <div class="post-header">${this.data.author}</div>
            <div class="post-media">${this.getMediaHTML()}</div>
            <div class="post-actions">
                <button id="like-btn-${this.id}" class="action-btn">❤️</button>
                <button id="comment-btn-modal-${this.id}" class="action-btn">💬</button>
                <button id="dm-btn-${this.id}" class="action-btn">✉️</button>
                <span id="likes-counter-${this.id}" style="margin-left: 10px;">${this.data.likes} Me gusta</span>
            </div>
            <div id="caption-container-${this.id}">
                </div>
            
            <button class="view-all-btn" id="toggle-comments-btn-${this.id}">
                Ver 0 comentarios
            </button>
            
            <div id="comments-section-${this.id}" class="full-comments hidden">
                </div>
        `;
        // Agrega el post al contenedor principal
        container.appendChild(postElement);

        // Asigna los manejadores de eventos a los botones de interacción
        postElement.querySelector(`#like-btn-${this.id}`).addEventListener('click', this._handleLike);
        postElement.querySelector(`#comment-btn-modal-${this.id}`).addEventListener('click', this._handleComment);
        postElement.querySelector(`#toggle-comments-btn-${this.id}`).addEventListener('click', () => this._toggleComments(this.id));
        postElement.querySelector(`#dm-btn-${this.id}`).addEventListener('click', this._handleShare);
        
        // Inicializa la sección de comentarios al cargar el post
        this.updateCommentSection();
    }
}
