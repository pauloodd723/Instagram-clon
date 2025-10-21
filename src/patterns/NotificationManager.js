// NotificationManager (Sujeto Observer): Gestiona las suscripciones y notificaciones por canales específicos
export const notificationManager = (() => {
    // Objeto privado que almacena las listas de suscriptores por canal
    const _subscribers = {
        likes: [],      // Lista de suscriptores para el canal de "likes"
        comments: [],   // Lista de suscriptores para el canal de "comments"
        default: []     // Lista de suscriptores por defecto (si el canal no existe)
    };

    // Retorna un objeto con los métodos públicos del NotificationManager
    return {
        // Método para suscribirse a un canal específico
        subscribe: (channel, callback) => {
            // Obtiene la lista de suscriptores correspondiente al canal o usa la lista por defecto
            const list = _subscribers[channel] || _subscribers.default;
            // Agrega la función callback a la lista de suscriptores
            list.push(callback);
            // Muestra un mensaje en consola confirmando la suscripción
            console.log(`[Observer] Suscripción exitosa al canal '${channel}'.`);
        },

        // Método para notificar a todos los suscriptores de un canal
        notify: (channel, data) => {
            // Obtiene la lista de suscriptores del canal o usa la lista por defecto
            const list = _subscribers[channel] || _subscribers.default;
            // Muestra un mensaje en consola indicando a cuántos suscriptores se notificará
            console.log(`[Observer] Notificando ${list.length} suscriptores en [${channel}].`);
            // Ejecuta cada callback de los suscriptores, pasando los datos de la notificación
            list.forEach(callback => callback(data));
        }
    };
})(); 
