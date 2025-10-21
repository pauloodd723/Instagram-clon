// Importa el NotificationManager (patrón Observer) para escuchar eventos globales de 'likes' y 'comments'
import { notificationManager } from '../patterns/NotificationManager.js';

/**
 * HeaderUI (Observador)
 * Se suscribe a los canales de notificación 'likes' y 'comments'.
 * Su función es actualizar los contadores, los registros (logs) y mostrar notificaciones flotantes.
 * Depende de la función global `showToastNotification()` (definida en main.js).
 */
export const HeaderUI = (() => {
    // Contadores de eventos
    let _likeCount = 0;        // Número total de "me gusta" recibidos
    let _commentCount = 0;     // Número total de comentarios recibidos
    
    // Referencias a elementos del DOM (interfaz)
    let _likeCounterEl = null;     // Elemento del contador visual de likes
    let _commentCounterEl = null;  // Elemento del contador visual de comentarios
    let _likesLogEl = null;        // Lista de logs de likes (historial)
    let _commentsLogEl = null;     // Lista de logs de comentarios (historial)

    /**
     * Manejador de notificaciones de "likes"
     * Se ejecuta cada vez que una publicación recibe un nuevo "me gusta".
     */
    const _handleLikeNotification = (data) => {
        _likeCount++; // Incrementa el contador interno

        // Actualiza el contador visual de likes en el header
        if (_likeCounterEl) {
            _likeCounterEl.textContent = _likeCount; // Muestra el total acumulado
            _likeCounterEl.style.display = 'block';  // Lo hace visible
        }
        
        // Agrega un registro al historial de likes
        if (_likesLogEl) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `Publicación de **${data.author}** recibió su **${data.newLikeCount}**° Me Gusta.`;
            _likesLogEl.prepend(listItem); // Agrega el nuevo evento al inicio del log
        }
        
        // Muestra una notificación flotante en pantalla (si está disponible)
        if (typeof window.showToastNotification === 'function') {
            window.showToastNotification(`❤️ Me gusta en el post de ${data.author}.`);
        }
    };

    /**
     * Manejador de notificaciones de "comments"
     * Se ejecuta cuando alguien comenta en una publicación.
     */
    const _handleCommentNotification = (data) => {
        _commentCount++; // Incrementa el contador interno de comentarios

        // Actualiza el contador visual de comentarios
        if (_commentCounterEl) {
            _commentCounterEl.textContent = _commentCount;
            _commentCounterEl.style.display = 'block';
        }

        // Agrega un registro al historial de comentarios
        if (_commentsLogEl) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `**${data.comment.user}** comentó en el post de **${data.author}**: "${data.comment.text}"`;
            _commentsLogEl.prepend(listItem);
        }
        
        // Muestra una notificación flotante si la función existe
        if (typeof window.showToastNotification === 'function') {
            window.showToastNotification(`💬 ${data.comment.user} comentó en el post de ${data.author}.`);
        }
    };

    return {
        /**
         * Inicializa el observador HeaderUI:
         * - Obtiene los elementos del DOM.
         * - Se suscribe a los canales 'likes' y 'comments'.
         * - Oculta los contadores hasta que se reciba alguna notificación.
         */
        init: () => {
            // Captura los elementos del DOM
            _likeCounterEl = document.getElementById('like-notification-counter');
            _commentCounterEl = document.getElementById('comment-notification-counter'); 
            _likesLogEl = document.getElementById('likes-log');
            _commentsLogEl = document.getElementById('comments-log');

            // Suscribirse a los eventos globales del NotificationManager
            notificationManager.subscribe('likes', _handleLikeNotification);
            notificationManager.subscribe('comments', _handleCommentNotification); 

            // Ocultar contadores al inicio
            if (_likeCounterEl) _likeCounterEl.style.display = 'none';
            if (_commentCounterEl) _commentCounterEl.style.display = 'none';
        }
    };
})();
