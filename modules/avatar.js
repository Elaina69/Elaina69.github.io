class Avatar {
    avatarVisible = false

    avatar = document.getElementById('githubAvatar');
    toggle = document.getElementById('toggle-avatar')

    title = document.querySelector('.title');
    bio = document.querySelector('.bio');
    skillsSection = document.querySelector('.skills-section');
    avatarContainer = document.querySelector('.github-avatar-container');

    toggleAvatar() {
        this.toggle.addEventListener('click', () => {
            this.avatarVisible = !this.avatarVisible;
            this.avatar.classList.toggle('show', this.avatarVisible);

            if (window.innerWidth <= 768) {
                const avatarHeight = this.avatarVisible ? 0 : -this.avatarContainer.offsetHeight;
                [this.title, this.bio, this.skillsSection].forEach(el => {
                    if (el) {
                        el.classList.add('shifted');
                        el.style.transform = `translateY(${avatarHeight}px)`;
                    }
                });
            } else {
                [this.title, this.bio, this.skillsSection].forEach(el => {
                    if (el) {
                        el.classList.remove('shifted');
                        el.style.transform = '';
                    }
                });
            }
        });
    }

    resetOnResize() {
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                [this.title, this.bio, this.skillsSection].forEach(el => {
                    if (el) {
                        el.classList.remove('shifted');
                        el.style.transform = '';
                    }
                });
            }
        });
    }
}

export { Avatar }