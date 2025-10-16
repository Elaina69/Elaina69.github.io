import projects from './configs/projects.js'

let defaultBackground = ""

function randomWebTitle() {
    const titles = [
        "Elaina Da Catto",
        "Nyan~~~",
        "Meow~"
    ];

    const randomIndex = Math.floor(Math.random() * titles.length);
    const title = titles[randomIndex];

    document.title = title;
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
            window.open(project.link, '_blank');
        }

        projectList.appendChild(projectItem);
    });
}

function setupProjectHovers() {
    const projectItems = document.querySelectorAll('.project-item');

    // Preload images
    projectItems.forEach(item => {
        const bgImage = item.getAttribute('data-bg');
        const img = new Image();
        img.src = bgImage;
    });

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
    
    purr()
    addProjectItems()
    setupProjectHovers()
});