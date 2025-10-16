import projects from './configs/projects.js'

let defaultBackground = ""

// function handleContact(type) {
//     const messages = {
//         github: 'Opening GitHub profile...',
//     };

//     console.log(messages[type]);
//     alert(messages[type] + '\n\nPlease update the links in the HTML with your actual contact information!');
// }

function switchSection(sectionName) {
    const sections = document.querySelectorAll('.content-left');
    const navButtons = document.querySelectorAll('.nav-btn');

    sections.forEach(section => {
        section.style.display = 'none';
    });

    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    if (!defaultBackground) {
        const portfolioContainer = document.querySelector('.portfolio-container');
        defaultBackground = portfolioContainer.style.backgroundImage;
    }

    const activeSection = document.getElementById(`${sectionName}-section`);
    if (activeSection) {
        activeSection.style.display = 'flex';
    }

    const activeButton = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    const portfolioContainer = document.querySelector('.portfolio-container');
    portfolioContainer.style.backgroundImage = `${defaultBackground}`;
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
        `;
        projectItem.onclick = () => {
            window.open(project.link, '_blank');
        }

        projectList.appendChild(projectItem);
    });
}

function setupProjectHovers() {
    const projectItems = document.querySelectorAll('.project-item');
    const portfolioContainer = document.querySelector('.portfolio-container');

    projectItems.forEach(item => {
        const bgImage = item.getAttribute('data-bg');

        item.addEventListener('mouseenter', () => {
            portfolioContainer.style.backgroundImage = `url('${bgImage}')`;
        });

        item.addEventListener('mouseleave', () => {
            portfolioContainer.style.backgroundImage = `${defaultBackground}`;
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    let RR = 0;

    const skillTags = document.querySelectorAll('.skill-tag');

    skillTags.forEach((tag, index) => {
        tag.style.animationDelay = `${index * 0.1}s`;
        tag.style.animation = 'fadeIn 0.3s ease-out forwards';
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
        });
    }, observerOptions);

    document.querySelectorAll('.skills-section, .contact-methods').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        observer.observe(section);
    });

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
        const section = btn.getAttribute('data-section');
        switchSection(section);
        });
    });

    addProjectItems();
    setupProjectHovers();

    document.querySelector("#purr").addEventListener("click", function() {
        RR++;
        if (RR >= 5) {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
            
            RR = 0;
        } 
        else {
            alert("Nyan~~~");
        }
    })
});
