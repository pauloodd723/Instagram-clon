import { BasePostModule } from './BasePostModule.js';

export class ImagePostModule extends BasePostModule {
    getMediaHTML() {
        return `<img src="${this.data.url}" alt="${this.data.caption}">`;
    }
}