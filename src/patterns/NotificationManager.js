/**
 * NotificationManager (Sujeto del patrón Observer)
 * Gestiona suscripciones y notificaciones por diferentes canales.
 * Canales soportados: 'likes', 'comments' y 'default'.
 */
export const notificationManager = (() => {
    // Objeto privado que contiene las listas de suscriptores por canal.
    const _subscribers = {
        likes: [],      // Suscriptores que escuchan eventos de "likes".
        comments: [],   // Suscriptores que escuchan eventos de "comments".
        default: []     // Canal genérico si no se especifica uno válido.
    };

    return {
        /**
         * Permite suscribir una función (callback) a un canal específico.
         * @param {string} channel - Canal al que se desea suscribir.
         * @param {Function} callback - Función a ejecutar cuando se notifique el canal.
         */
        subscribe: (channel, callback) => {
            // Si el canal no existe, se usa el canal por defecto.
            const list = _subscribers[channel] || _subscribers.default;
            // Se agrega el callback a la lista de suscriptores.
            list.push(callback);
            console.log(`[Observer] Suscripción exitosa al canal '${channel}'.`);
        },

        /**
         * Notifica a todos los suscriptores registrados en un canal.
         * @param {string} channel - Canal a notificar (likes, comments, etc.).
         * @param {*} data - Información que se enviará a los suscriptores.
         */
        notify: (channel, data) => {
            // Si el canal no existe, se usa el canal por defecto.
            const list = _subscribers[channel] || _subscribers.default;
            console.log(`[Observer] Notificando ${list.length} suscriptores en [${channel}].`);
            // Se ejecutan todos los callbacks asociados a ese canal.
            list.forEach(callback => callback(data));
        }
    };
})();
