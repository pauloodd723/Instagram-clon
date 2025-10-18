import { feedManager } from './patterns/FeedManager.js';
import { HeaderUI } from './ui/HeaderUI.js';

const USER_NAME = "TuNuevoUsuario";
let postIdCounter = 200; // Para dar IDs únicos a posts nuevos

// --- Función de Notificación Flotante (Toast) ---
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

    setTimeout(() => {
        toast.classList.remove('slide-in');
        toast.classList.add('slide-out'); 
    }, 3000);
}


// --- Lógica de Subida de Post (Punto 1) ---

function handleCameraClick() {
    document.getElementById('upload-modal-container').classList.remove('hidden');
}

function handleUploadPost() {
    const typeSelect = document.getElementById('upload-type').value;
    const caption = document.getElementById('upload-caption').value || "Nueva publicación desde la cámara";
    const urlInput = document.getElementById('upload-url').value;
    const urlsInput = document.getElementById('upload-urls').value;

    let postData = {
        id: postIdCounter++,
        author: USER_NAME,
        caption: caption,
        likes: 0,
        comments: []
    };

    if (typeSelect === 'gallery') {
        const urlsArray = urlsInput.split(',').map(url => url.trim()).filter(url => url !== "");
        if (urlsArray.length < 2) {
            alert("Para una Galería, ingresa al menos dos URLs separadas por coma.");
            return;
        }
        postData.type = 'gallery';
        postData.urls = urlsArray;
    } else {
        if (!urlInput) {
            alert(`Ingresa una URL de imagen o video válida para el tipo ${typeSelect}.`);
            return;
        }
        postData.type = typeSelect;
        postData.url = urlInput;
    }

    feedManager.addPost(postData.type, postData);
    
    // Resetear formulario y cerrar modal
    document.getElementById('upload-modal-container').classList.add('hidden');
    document.getElementById('upload-form').reset();
}

// Función para alternar los campos URL según el tipo
function handleTypeChange(event) {
    const type = event.target.value;
    const urlGroup = document.getElementById('url-group');
    const urlsGroup = document.getElementById('urls-group');
    
    if (type === 'gallery') {
        urlGroup.classList.add('hidden');
        urlsGroup.classList.remove('hidden');
    } else {
        urlGroup.classList.remove('hidden');
        urlsGroup.classList.add('hidden');
    }
}


// --- Datos de simulación (Incluyendo Gallery Post - Punto 2) ---
const mockFeedData = [
    { id: 101, type: 'image', author: 'Ana López', caption: 'Viaje a la montaña. ¡Qué vistas!', likes: 5, comments: [{ user: 'Alex', text: '¡Genial foto!', timestamp: '10:00' }], url: 'https://picsum.photos/600/600?random=1' },
    { id: 102, type: 'video', author: 'Carlos Ruiz', caption: 'Probando el nuevo código JS.', likes: 12, comments: [{ user: 'DevGuy', text: 'Impresionante trabajo.', timestamp: '11:00' }], url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 103, type: 'gallery', author: 'FotoViajero', caption: 'Un carrusel de mi último viaje.', likes: 30, comments: [], urls: ['https://picsum.photos/600/600?random=10', 'https://picsum.photos/600/600?random=11', 'https://picsum.photos/600/600?random=12'] }, // NUEVO TIPO DE POST
    { id: 104, type: 'image', author: 'María Elena', caption: 'Receta del día: Pasta con pesto.', likes: 20, comments: [], url: 'https://picsum.photos/600/600?random=2' },
];

function initializeApp() {
    const appContainer = document.querySelector('#app');
    if (!appContainer) return;

    // 1. INYECTAR LA ESTRUCTURA HTML principal
    appContainer.innerHTML = `
        <header id="main-header">
            <div class="header-content">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" alt="Instagram Logo" class="insta-logo">
                <div class="header-icons">
                    <span class="icon-notification icon-upload" id="camera-button">📸</span>
                    
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
        <div id="upload-modal-container" class="modal-container hidden">
            <div class="modal-content">
                <h3>Subir Nueva Publicación (Simulación)</h3>
                <form id="upload-form">
                    <label for="upload-type">Tipo de Post:</label>
                    <select id="upload-type" onchange="handleTypeChange(event)">
                        <option value="image">Imagen Sencilla</option>
                        <option value="video">Video</option>
                        <option value="gallery">Galería (Carrusel)</option>
                    </select>
                    
                    <label for="upload-caption">Descripción:</label>
                    <input type="text" id="upload-caption" placeholder="Escribe una descripción (opcional)">

                    <div id="url-group">
                        <label for="upload-url">Link de Media (Imagen/Video):</label>
                        <input type="text" id="upload-url" placeholder="Ej: https://picsum.photos/600/600">
                    </div>

                    <div id="urls-group" class="hidden">
                        <label for="upload-urls">Links de Galería (URLs separadas por coma):</label>
                        <textarea id="upload-urls" placeholder="Ej: url1, url2, url3"></textarea>
                    </div>
                    
                    <button type="button" onclick="handleUploadPost()">Subir Publicación</button>
                    <button type="button" onclick="document.getElementById('upload-modal-container').classList.add('hidden')">Cancelar</button>
                </form>
            </div>
        </div>
    `;
    
    // 2. CONFIGURAR INTERACCIONES DEL HEADER
    HeaderUI.init();
    
    // Asignar handlers globales (Scroll y Modal)
    const logo = appContainer.querySelector('.insta-logo');
    const heartIcon = appContainer.querySelector('.icon-heart');
    const dmIcon = appContainer.querySelector('.icon-dm');
    const cameraButton = appContainer.querySelector('#camera-button');

    // Scroll-to-Top
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
    
    // Abrir Modal de Subida (Punto 1)
    if (cameraButton) {
        cameraButton.addEventListener('click', handleCameraClick);
    }
    
    // Toggle de Dropdown de Notificaciones
    const toggleDropdown = (dropdownId, otherDropdownId) => {
        const dropdown = appContainer.querySelector(dropdownId);
        const otherDropdown = appContainer.querySelector(otherDropdownId);
        if (dropdown) dropdown.classList.toggle('hidden');
        if (otherDropdown) otherDropdown.classList.add('hidden');
    };

    heartIcon.addEventListener('click', (e) => {
        e.stopPropagation(); 
        toggleDropdown('#likes-dropdown', '#comments-dropdown');
    });
    dmIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown('#comments-dropdown', '#likes-dropdown');
    });
    document.addEventListener('click', () => {
        appContainer.querySelector('#likes-dropdown')?.classList.add('hidden');
        appContainer.querySelector('#comments-dropdown')?.classList.add('hidden');
    });
    // Hacer las funciones de modal globales para el HTML inyectado
    window.handleTypeChange = handleTypeChange;
    window.handleUploadPost = handleUploadPost;


    // 3. POBLAR EL FEED
    console.log("Iniciando carga del Feed...");
    mockFeedData.forEach(data => {
        feedManager.addPost(data.type, data);
    });
}

initializeApp();