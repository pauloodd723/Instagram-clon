import { notificationManager } from '../patterns/NotificationManager.js';

/**
 * HeaderUI (Observador): Se suscribe a 'likes' y 'comments', actualiza contadores y logs.
 * Depende de la función global showToastNotification (definida en main.js).
 */
export const HeaderUI = (() => {
    let _likeCount = 0;
    let _commentCount = 0; 
    
    let _likeCounterEl = null; 
    let _commentCounterEl = null; 
    let _likesLogEl = null;    
    let _commentsLogEl = null; 

    const _handleLikeNotification = (data) => {
        _likeCount++; 
        if (_likeCounterEl) {
            _likeCounterEl.textContent = _likeCount; 
            _likeCounterEl.style.display = 'block'; 
        }
        
        // Actualizar log de likes (Punto 2)
        if (_likesLogEl) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `Publicación de **${data.author}** recibió su **${data.newLikeCount}**° Me Gusta.`;
            _likesLogEl.prepend(listItem); 
        }
        
        // Activar notificación flotante (Punto 3)
        if (typeof window.showToastNotification === 'function') {
            window.showToastNotification(`❤️ Me gusta en el post de ${data.author}.`);
        }
    };

    const _handleCommentNotification = (data) => {
        _commentCount++;
        if (_commentCounterEl) {
            _commentCounterEl.textContent = _commentCount;
            _commentCounterEl.style.display = 'block';
        }

        // Actualizar log de comentarios (Punto 2)
        if (_commentsLogEl) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `**${data.comment.user}** comentó en el post de **${data.author}**: "${data.comment.text}"`;
            _commentsLogEl.prepend(listItem); 
        }
        
        // Activar notificación flotante (Punto 3)
        if (typeof window.showToastNotification === 'function') {
            window.showToastNotification(`💬 ${data.comment.user} comentó en el post de ${data.author}.`);
        }
    };

    return {
        init: () => {
            _likeCounterEl = document.getElementById('like-notification-counter');
            _commentCounterEl = document.getElementById('comment-notification-counter'); 
            _likesLogEl = document.getElementById('likes-log');
            _commentsLogEl = document.getElementById('comments-log');

            // Suscribir a AMBOS canales
            notificationManager.subscribe('likes', _handleLikeNotification);
            notificationManager.subscribe('comments', _handleCommentNotification); 

            // Ocultar contadores inicialmente
            if (_likeCounterEl) _likeCounterEl.style.display = 'none';
            if (_commentCounterEl) _commentCounterEl.style.display = 'none';
        }
    };
})();