/*
 Main Entry Point for Homepage
 */

// Import Modules
import { initCanvasAnimation } from './modules/index-canvas-animation.js';
import { initThreeScene } from './modules/index-three-scene.js';
import { initFeedbackForm } from './modules/index-feedback-form-handler.js';
import { initUIInteractions } from './modules/index-ui-interactions.js';

/*
  Initialize all application modules when the DOM is fully loaded.
 */
function initializeApp() {
    console.log('Initializing EGM Dental Clinic Homepage...');

    // Background Animation (Canvas)
    initCanvasAnimation();

    // 3D Tooth Model (Three.js)
    initThreeScene();

    // Contact Form Validation
    initFeedbackForm();

    // UI Effects 
    initUIInteractions();

    console.log('All modules initialized successfully.');
}

// Ensure DOM is ready before running
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
