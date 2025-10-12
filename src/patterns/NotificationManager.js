/**
 * NotificationManager (Sujeto Observer): Gestiona suscripciones y notificaciones por canales.
 * Canales: 'likes' y 'comments'.
 */
export const notificationManager = (() => {
    const _subscribers = {
        likes: [],
        comments: [],
        default: []
    };

    return {
        subscribe: (channel, callback) => {
            const list = _subscribers[channel] || _subscribers.default;
            list.push(callback);
            console.log(`[Observer] Suscripción exitosa al canal '${channel}'.`);
        },

        notify: (channel, data) => {
            const list = _subscribers[channel] || _subscribers.default;
            console.log(`[Observer] Notificando ${list.length} suscriptores en [${channel}].`);
            list.forEach(callback => callback(data));
        }
    };
})();