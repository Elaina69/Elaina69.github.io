import projects from './configs/projects.js'
import { marked } from 'https://cdn.jsdelivr.net/npm/marked@11.1.1/+esm'

let defaultBackground = ""
let currentProjectBackground = ""

function randomWebTitle() {
    const titles = [
        "Elaina Da Catto",
        "Nyan~~~",
        "Meow~",
        "≽^- ˕ -^≼"
    ];

    const randomIndex = Math.floor(Math.random() * titles.length);
    const title = titles[randomIndex];

    document.title = title;
}

function preloadProjectImages() {
    projects.forEach(project => {
        const img = new Image();
        img.src = project.background;
    });
}

function updateBackground(imageUrl) {
    const portfolioContainer = document.querySelector('.portfolio-container');
    portfolioContainer.style.backgroundImage = imageUrl;
}

function switchSection(sectionName) {
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
    if (!defaultBackground) {
        const portfolioContainer = document.querySelector('.portfolio-container');
        defaultBackground = portfolioContainer.style.backgroundImage;
    }

    // Reset background to default when switching sections
    updateBackground(defaultBackground);
}

async function fetchReadme(repoUrl) {
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

function openProjectModal(project) {
    const modal = document.getElementById('projectModal');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalReadme = document.getElementById('modalReadme');
    const githubLink = document.getElementById('githubLink');

    currentProjectBackground = project.background;
    modalOverlay.style.backgroundImage = `url(${project.background})`;

    modalReadme.innerHTML = '<div class="loading">Loading README...</div>';
    githubLink.href = project.link;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    fetchReadme(project.link).then(htmlContent => {
        modalReadme.innerHTML = htmlContent;
    });
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentProjectBackground = "";
}

function addProjectItems() {
    const projectList = document.querySelector('.projects-list');

    projects.forEach(project => {
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

        projectItem.onclick = () => {
            openProjectModal(project);
        }

        projectList.appendChild(projectItem);
    });
}

function setupProjectHovers() {
    const projectItems = document.querySelectorAll('.project-item');

    // Change background on hover
    projectItems.forEach(item => {
        const bgImage = item.getAttribute('data-bg');

        item.addEventListener('mouseenter', () => {
            updateBackground(`url(${bgImage})`);
        });

        item.addEventListener('mouseleave', () => {
            updateBackground(defaultBackground);
        });
    });
}

function purr() {
    let RR = 0;

    document.querySelector("#purr").addEventListener("click", function() {
        RR++;
        if (RR >= 5) {
            // Imma rickroll then
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
            
            RR = 0;
        } 
        else {
            alert("Nyan~~~");
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    randomWebTitle();

    const skillTags = document.querySelectorAll('.skill-tag');

    skillTags.forEach((tag, index) => {
        tag.style.animationDelay = `${index * 0.1}s`;
        tag.style.animation = 'fadeIn 0.3s ease-out forwards';
    });

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.getAttribute('data-section');
            switchSection(section);
        });
    });

    const modalClose = document.getElementById('modalClose');
    const modal = document.getElementById('projectModal');

    modalClose.addEventListener('click', closeProjectModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeProjectModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProjectModal();
        }
    });

    purr()
    addProjectItems()
    preloadProjectImages()
    setupProjectHovers()
});