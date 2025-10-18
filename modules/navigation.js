import { updateBackground } from './background.js';

class Navigation {
    navButtonsSetup() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.getAttribute('data-section');
                this.switchSection(section);
            });
        });
    }

    switchSection(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.content-left');
        sections.forEach(section => {
            section.style.display = 'none';
        });

        // Show the active section
        const activeSection = document.getElementById(`${sectionName}-section`);
        if (activeSection) {
            activeSection.style.display = 'flex';
        }

        // Remove active class from all nav buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to the clicked button
        const activeButton = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // If defaultBackground is not set, set it to the current background
        const portfolioContainer = document.querySelector('.portfolio-container');
        window.defaultBackground = window.getComputedStyle(portfolioContainer).backgroundImage;

        // Reset background to default when switching sections
        updateBackground(window.defaultBackground);
    }
}

export { Navigation }