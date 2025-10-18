import { marked } from 'https://cdn.jsdelivr.net/npm/marked@11.1.1/+esm'

class Modal {
    async fetchReadme(repoUrl) {
        try {
            const urlParts = repoUrl.replace('https://github.com/', '').split('/');
            const owner = urlParts[0];
            const repo = urlParts[1];

            const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
            const response = await fetch(apiUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3.raw'
                }
            });

            if (!response.ok) {
                throw new Error('README not found');
            }

            const readmeContent = await response.text();
            return marked.parse(readmeContent);
        } catch (error) {
            return '<p>Unable to load README. Please visit the GitHub page for more information.</p>';
        }
    }

    openProjectModal(project) {
        const modal = document.getElementById('projectModal');
        const modalOverlay = modal.querySelector('.modal-overlay');
        const modalReadme = document.getElementById('modalReadme');
        const githubLink = document.getElementById('githubLink');

        if (project.background && project.background !== "none") {
            modalOverlay.style.backgroundImage = `url(${project.background})`;
        } 
        else if (window.defaultBackground && window.defaultBackground !== 'none') {
            modalOverlay.style.backgroundImage = window.defaultBackground;
        } 
        else {
            modalOverlay.style.backgroundImage = '';
        }

        modalReadme.innerHTML = '<div class="loading">Loading README...</div>';
        githubLink.href = project.link;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        this.fetchReadme(project.link).then(htmlContent => {
            modalReadme.innerHTML = htmlContent;
        });
    }

    closeProjectModal() {
        const modal = document.getElementById('projectModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    setupModalListeners() {
        const modalClose = document.getElementById('modalClose');
        const modal = document.getElementById('projectModal');

        if (!modal) return;

        modalClose?.addEventListener('click', this.closeProjectModal.bind(this));

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeProjectModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeProjectModal();
            }
        });
    }
}

const modalInstance = new Modal();

const openProjectModal = modalInstance.openProjectModal.bind(modalInstance);
const setupModalListeners = modalInstance.setupModalListeners.bind(modalInstance);

export { openProjectModal, setupModalListeners };