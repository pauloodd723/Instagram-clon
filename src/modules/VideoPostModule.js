import { BasePostModule } from './BasePostModule.js';

export class VideoPostModule extends BasePostModule {
    getMediaHTML() {
        return `
            <video width="100%" controls preload="metadata" poster="https://via.placeholder.com/600x400.png?text=Video+Placeholder">
                <source src="${this.data.url}" type="video/mp4">
                Tu navegador no soporta el tag de video.
            </video>
        `;
    }
}