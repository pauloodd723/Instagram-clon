import { notificationManager } from '../patterns/NotificationManager.js';

/**
 * HeaderUI (Observador): Se encarga de escuchar los eventos emitidos por el NotificationManager.
 * Se suscribe a los canales 'likes' y 'comments' para actualizar los contadores del encabezado,
 * mostrar los registros de actividad y activar notificaciones flotantes.
 */
export const HeaderUI = (() => {
    // Contadores internos de notificaciones
    let _likeCount = 0;
    let _commentCount = 0; 
    
    // Referencias a elementos del DOM
    let _likeCounterEl = null; 
    let _commentCounterEl = null; 
    let _likesLogEl = null;    
    let _commentsLogEl = null; 

    /**
     * Maneja las notificaciones del canal 'likes'.
     * Actualiza el contador de likes, el log y muestra una notificación flotante.
     */
    const _handleLikeNotification = (data) => {
        _likeCount++; // Incrementa el contador de likes totales

        // Actualiza el contador visual en el encabezado
        if (_likeCounterEl) {
            _likeCounterEl.textContent = _likeCount; 
            _likeCounterEl.style.display = 'block'; 
        }
        
        // Agrega un nuevo registro al log de likes
        if (_likesLogEl) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `Publicación de **${data.author}** recibió su **${data.newLikeCount}**° Me Gusta.`;
            _likesLogEl.prepend(listItem); // Lo inserta al inicio de la lista
        }
        
        // Muestra una notificación flotante (si existe la función global)
        if (typeof window.showToastNotification === 'function') {
            window.showToastNotification(`❤️ Me gusta en el post de ${data.author}.`);
        }
    };

    /**
     * Maneja las notificaciones del canal 'comments'.
     * Actualiza el contador de comentarios, el log y muestra una notificación flotante.
     */
    const _handleCommentNotification = (data) => {
        _commentCount++; // Incrementa el contador de comentarios totales

        // Actualiza el contador visual en el encabezado
        if (_commentCounterEl) {
            _commentCounterEl.textContent = _commentCount;
            _commentCounterEl.style.display = 'block';
        }

        // Agrega un nuevo registro al log de comentarios
        if (_commentsLogEl) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `**${data.comment.user}** comentó en el post de **${data.author}**: "${data.comment.text}"`;
            _commentsLogEl.prepend(listItem); // Lo inserta al inicio de la lista
        }
        
        // Muestra una notificación flotante (si existe la función global)
        if (typeof window.showToastNotification === 'function') {
            window.showToastNotification(`💬 ${data.comment.user} comentó en el post de ${data.author}.`);
        }
    };

    return {
        /**
         * Inicializa el observador HeaderUI:
         * - Obtiene referencias a los elementos del DOM.
         * - Se suscribe a los canales 'likes' y 'comments'.
         * - Oculta los contadores al inicio.
         */
        init: () => {
            _likeCounterEl = document.getElementById('like-notification-counter');
            _commentCounterEl = document.getElementById('comment-notification-counter'); 
            _likesLogEl = document.getElementById('likes-log');
            _commentsLogEl = document.getElementById('comments-log');

            // Suscribirse a los canales del NotificationManager
            notificationManager.subscribe('likes', _handleLikeNotification);
            notificationManager.subscribe('comments', _handleCommentNotification); 

            // Ocultar contadores inicialmente hasta que haya actividad
            if (_likeCounterEl) _likeCounterEl.style.display = 'none';
            if (_commentCounterEl) _commentCounterEl.style.display = 'none';
        }
    };
})();
