import { notificationManager } from '../patterns/NotificationManager.js';

/**
 * BasePostModule (Módulo): Clase base para todas las publicaciones. 
 * Contiene la lógica de 'like', comentarios (publicador), compartir y renderizado UI local.
 */
export class BasePostModule {
    constructor(data) {
        this.data = { 
            ...data, 
            likes: data.likes || 0,
            comments: data.comments || [] // Inicializar array de comentarios
        };
        this.id = data.id;
    }

    getMediaHTML() {
        // Obliga a las subclases (Image/Video) a implementar su propio renderizado de contenido.
        throw new Error("El método getMediaHTML() debe ser implementado por la subclase.");
    }

    // --- Lógica de Interacciones ---

    _handleLike = () => {
        this.data.likes++;
        
        // 1. Publicar evento 'likes' (Observer)
        notificationManager.notify('likes', { 
            postId: this.id, 
            author: this.data.author,
            newLikeCount: this.data.likes 
        });

        // 2. Actualizar la UI local
        const likeCounter = document.getElementById(`likes-counter-${this.id}`);
        if (likeCounter) {
            likeCounter.textContent = `${this.data.likes} Me gusta`;
        }
    }

    _handleComment = () => {
        const commentText = prompt(`Comentar en la publicación de ${this.data.author}:`);
        if (commentText && commentText.trim() !== "") {
            const newComment = { 
                user: "Freddy777", 
                text: commentText.trim(),
                timestamp: new Date().toLocaleTimeString()
            };
            this.data.comments.push(newComment); 
            this.updateCommentSection(); // Actualizar la vista de comentarios en el DOM

            // 1. Publicar evento 'comments' (Observer)
            notificationManager.notify('comments', { 
                postId: this.id, 
                author: this.data.author,
                comment: newComment 
            });
        }
    }

    _handleShare = () => {
        alert(`Compartiendo la publicación de ${this.data.author} por mensaje directo (DM). ¡Simulación de envío!`);
    }

    // --- Lógica de UI Local ---

    _toggleComments = (postId) => {
        const commentsSection = document.getElementById(`comments-section-${postId}`);
        const button = document.getElementById(`toggle-comments-btn-${postId}`);
        if (commentsSection) {
            const isHidden = commentsSection.classList.toggle('hidden');
            if (button) {
                 button.textContent = isHidden ? 
                    `Ver ${this.data.comments.length} comentarios` : 
                    `Ocultar comentarios`;
            }
        }
    }

    updateCommentSection() {
        const commentContainer = document.getElementById(`comments-section-${this.id}`);
        const captionContainer = document.getElementById(`caption-container-${this.id}`);
        const toggleButton = document.getElementById(`toggle-comments-btn-${this.id}`);

        if (!commentContainer || !captionContainer || !toggleButton) return;
        
        // 1. Renderizar la vista previa (caption + último comentario)
        if (this.data.comments.length > 0) {
            const lastComment = this.data.comments[this.data.comments.length - 1];
            captionContainer.innerHTML = `
                <p class="post-caption"><strong>${this.data.author}:</strong> ${this.data.caption}</p>
                <p class="post-comment-preview"><strong>${lastComment.user}:</strong> ${lastComment.text}</p>
            `;
        } else {
            captionContainer.innerHTML = `<p class="post-caption"><strong>${this.data.author}:</strong> ${this.data.caption}</p>`;
        }

        // 2. Renderizar la lista completa de comentarios (para el toggle)
        const allCommentsHTML = this.data.comments.map(c => `
            <p class="full-comment"><strong>${c.user}:</strong> ${c.text} <span>(${c.timestamp})</span></p>
        `).join('');

        commentContainer.innerHTML = `<div class="comment-list">${allCommentsHTML}</div>`;
        
        // 3. Actualizar el texto del botón de toggle
        toggleButton.textContent = `Ver ${this.data.comments.length} comentarios`;
        toggleButton.style.display = this.data.comments.length > 0 ? 'block' : 'none';
        
    }
    
    render(container) {
        const postElement = document.createElement('div');
        postElement.className = 'post-module';
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
        container.appendChild(postElement);

        // Adjuntar manejadores de eventos a los botones
        postElement.querySelector(`#like-btn-${this.id}`).addEventListener('click', this._handleLike);
        postElement.querySelector(`#comment-btn-modal-${this.id}`).addEventListener('click', this._handleComment);
        postElement.querySelector(`#toggle-comments-btn-${this.id}`).addEventListener('click', () => this._toggleComments(this.id));
        postElement.querySelector(`#dm-btn-${this.id}`).addEventListener('click', this._handleShare); // Manejador de DM/Compartir
        
        // Inicializar la sección de comentarios
        this.updateCommentSection();
    }
}