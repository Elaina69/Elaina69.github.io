import { CustomFont } from './modules/customFonts.js'
import { WebTitles } from './modules/webTitles.js'
import { Navigation } from './modules/navigation.js'
import { Avatar } from './modules/avatar.js'
import { Project } from './modules/myProjects.js'
import { Purr } from './modules/purr.js'

import { setupModalListeners } from './modules/modal.js'

let defaultBackground = ""
window.defaultBackground = defaultBackground;

// Main function to initialize the webpage
function main() {
    // Apply custom font
    const customFont = new CustomFont();
    customFont.applyCustomFont()

    // Set random web title
    const webTitles = new WebTitles();
    webTitles.randomWebTitle()

    // Setup navigation buttons
    const navigation = new Navigation();
    navigation.navButtonsSetup()

    // Setup avatar
    const avatar = new Avatar();
    avatar.toggleAvatar()
    avatar.resetOnResize()
    avatar.toggle.click()

    // Setup projects and modal
    const project = new Project();
    project.setupProject()
    setupModalListeners()
}

document.addEventListener('DOMContentLoaded', () => {
    main()
    const purr = new Purr();
    purr.purr();
});