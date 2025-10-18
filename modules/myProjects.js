import projects from '../configs/projects.js'
import { openProjectModal } from './modal.js'
import { updateBackground } from './background.js'

class Project {
    preloadProjectImages() {
        projects.forEach(project => {
            const img = new Image();

            if (project.background == 'none') return;

            img.src = project.background;
        });
    }

    addProjectItems() {
        const projectList = document.querySelector('.projects-list');

        projects.forEach(project => {
            // Create project item element
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            projectItem.setAttribute('data-bg', project.background);

            projectItem.innerHTML = `
                <h3 class="project-name">${project.name}</h3>
                <p class="project-desc">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            `

            // Hover events to change background
            const bgImage = projectItem.getAttribute('data-bg');
            projectItem.addEventListener('mouseenter', () => {
                if (bgImage == 'none') return;
                
                updateBackground(`url(${bgImage})`);
            });

            projectItem.addEventListener('mouseleave', () => {
                updateBackground(window.defaultBackground);
            });

            // Click event to open modal
            projectItem.onclick = () => {
                openProjectModal(project);
            }

            projectList.appendChild(projectItem);
        });
    }

    setupProject() {
        this.addProjectItems()
        this.preloadProjectImages()
    }
}

export { Project }