import { feedManager } from './patterns/FeedManager.js';
import { HeaderUI } from './ui/HeaderUI.js';

// --- Función de Notificación Flotante (Toast - Punto 3) ---
// Se adjunta a window para que HeaderUI la pueda usar
window.showToastNotification = function(message) {
    let toast = document.getElementById('toast-notification');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        document.body.appendChild(toast);
    }
    
    toast.innerHTML = `<p>${message}</p>`;
    toast.classList.remove('hidden', 'slide-out'); 
    toast.classList.add('slide-in'); 

    // Quitar automáticamente después de 3 segundos
    setTimeout(() => {
        toast.classList.remove('slide-in');
        toast.classList.add('slide-out'); 
    }, 3000);
}


// --- Datos de simulación ---
const mockFeedData = [
    { id: 101, type: 'image', author: 'Ana López', caption: 'Viaje a la montaña. ¡Qué vistas!', likes: 5, comments: [{ user: 'Alex', text: '¡Genial foto!', timestamp: '10:00' }], url: 'https://picsum.photos/600/600?random=1' },
    { id: 102, type: 'video', author: 'Carlos Ruiz', caption: 'Probando el nuevo código JS.', likes: 12, comments: [{ user: 'DevGuy', text: 'Impresionante trabajo.', timestamp: '11:00' }], url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 103, type: 'image', author: 'María Elena', caption: 'Receta del día: Pasta con pesto.', likes: 20, comments: [], url: 'https://picsum.photos/600/600?random=2' },
];

function initializeApp() {
    const appContainer = document.querySelector('#app');
    if (!appContainer) return;

    // 1. INYECTAR LA ESTRUCTURA HTML (con logs y botones de toggle)
    appContainer.innerHTML = `
        <header id="main-header">
            <div class="header-content">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" alt="Instagram Logo" class="insta-logo">
                <div class="header-icons">
                    
                    <span class="icon-notification icon-heart">
                        ❤️
                        <span id="like-notification-counter" class="notification-badge"></span>
                        <div id="likes-dropdown" class="notification-dropdown hidden">
                            <h3>Actividad de Me Gusta</h3>
                            <ul id="likes-log"></ul>
                        </div>
                    </span>
                    
                    <span class="icon-notification icon-dm">
                        ✉️
                        <span id="comment-notification-counter" class="notification-badge"></span>
                        <div id="comments-dropdown" class="notification-dropdown hidden">
                            <h3>Nuevos Comentarios</h3>
                            <ul id="comments-log"></ul>
                        </div>
                    </span>
                </div>
            </div>
        </header>
        <div id="feed-container">
            </div>
    `;
    
    // 2. CONFIGURAR INTERACCIONES DEL HEADER
    HeaderUI.init();
    
    // Scroll-to-Top (Punto 1)
    const logo = appContainer.querySelector('.insta-logo');
    const heartIcon = appContainer.querySelector('.icon-heart');
    const dmIcon = appContainer.querySelector('.icon-dm');

    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
    
    // Toggle de Dropdown de Notificaciones (Punto 2)
    const toggleDropdown = (dropdownId, otherDropdownId) => {
        const dropdown = appContainer.querySelector(dropdownId);
        const otherDropdown = appContainer.querySelector(otherDropdownId);
        if (dropdown) dropdown.classList.toggle('hidden');
        if (otherDropdown) otherDropdown.classList.add('hidden');
    };

    heartIcon.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que el click cierre inmediatamente
        toggleDropdown('#likes-dropdown', '#comments-dropdown');
    });
    dmIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown('#comments-dropdown', '#likes-dropdown');
    });
    // Cierre global del dropdown al hacer clic en cualquier otro lugar
    document.addEventListener('click', () => {
        appContainer.querySelector('#likes-dropdown')?.classList.add('hidden');
        appContainer.querySelector('#comments-dropdown')?.classList.add('hidden');
    });


    // 3. POBLAR EL FEED
    console.log("Iniciando carga del Feed...");
    mockFeedData.forEach(data => {
        feedManager.addPost(data.type, data);
    });

    // 4. DEMOSTRACIÓN
    setTimeout(() => {
        console.log("--- Cargando más contenido Asíncrono ---");
        feedManager.addPost('image', { 
            id: 104, 
            type: 'image', 
            author: 'Patrocinador', 
            caption: 'Nuevo producto en la tienda. ¡No te lo pierdas!', 
            likes: 0, 
            comments: [],
            url: 'https://picsum.photos/600/600?random=3' 
        });
    }, 4000);
}

initializeApp();