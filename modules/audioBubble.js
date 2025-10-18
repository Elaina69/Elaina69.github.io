class AudioBubble {
    constructor(bubbleId = 'audio-bubble', popupId = 'audio-player-popup') {
        this.bubble = document.getElementById(bubbleId);
        this.popup = document.getElementById(popupId);
        this.offsetX = 0;
        this.offsetY = 0;
        this.dragging = false;
        this.isOpen = false;
    }

    setupDrag() {
        this.bubble.addEventListener('mousedown', (e) => {
            this.dragging = true;
            this.offsetX = e.clientX - this.bubble.offsetLeft;
            this.offsetY = e.clientY - this.bubble.offsetTop;
            this.bubble.style.transition = 'none';
        });
        document.addEventListener('mousemove', (e) => {
            if (!this.dragging) return;
            let x = e.clientX - this.offsetX;
            let y = e.clientY - this.offsetY;
            x = Math.max(0, Math.min(window.innerWidth - this.bubble.offsetWidth, x));
            y = Math.max(0, Math.min(window.innerHeight - this.bubble.offsetHeight, y));
            this.bubble.style.left = x + 'px';
            this.bubble.style.top = y + 'px';
            this.bubble.style.right = 'unset';
            this.bubble.style.bottom = 'unset';
            this.bubble.style.position = 'fixed';
            this.updatePopupPosition();
        });
        document.addEventListener('mouseup', () => {
            this.dragging = false;
            this.bubble.style.transition = '';
        });
    }

    setupTouchDrag() {
        this.bubble.addEventListener('touchstart', (e) => {
            this.dragging = true;
            const touch = e.touches[0];
            this.offsetX = touch.clientX - this.bubble.offsetLeft;
            this.offsetY = touch.clientY - this.bubble.offsetTop;
            this.bubble.style.transition = 'none';
        });
        document.addEventListener('touchmove', (e) => {
            if (!this.dragging) return;
            const touch = e.touches[0];
            let x = touch.clientX - this.bubble.offsetWidth / 2;
            let y = touch.clientY - this.bubble.offsetHeight / 2;
            x = Math.max(0, Math.min(window.innerWidth - this.bubble.offsetWidth, x));
            y = Math.max(0, Math.min(window.innerHeight - this.bubble.offsetHeight, y));
            this.bubble.style.left = x + 'px';
            this.bubble.style.top = y + 'px';
            this.bubble.style.right = 'unset';
            this.bubble.style.bottom = 'unset';
            this.bubble.style.position = 'fixed';
            this.updatePopupPosition();
        });
        document.addEventListener('touchend', () => {
            this.dragging = false;
            this.bubble.style.transition = '';
        });
    }

    setupToggle() {
        this.bubble.addEventListener('click', () => {
            this.isOpen = !this.isOpen;
            this.popup.classList.toggle('hidden', !this.isOpen);
            setTimeout(() => this.updatePopupPosition(), 10);
        });
    }

    setupOutsideClick() {
        document.addEventListener('mousedown', (e) => {
            if (this.isOpen && !this.popup.contains(e.target) && !this.bubble.contains(e.target)) {
                this.popup.classList.add('hidden');
                this.isOpen = false;
            }
        });
    }

    setupPopupPosition() {
        // Ensure popup follows bubble after drag
        this.bubble.addEventListener('mousedown', () => {
            setTimeout(() => this.updatePopupPosition(), 10);
        });
        this.bubble.addEventListener('touchstart', () => {
            setTimeout(() => this.updatePopupPosition(), 10);
        });
    }

    updatePopupPosition() {
        const bubbleRect = this.bubble.getBoundingClientRect();
        let left = bubbleRect.left;
        let top = bubbleRect.top - this.popup.offsetHeight - 12;

        // Nếu popup bị tràn phải, dịch sang trái
        if (left + this.popup.offsetWidth > window.innerWidth) {
            left = window.innerWidth - this.popup.offsetWidth - 12;
        }
        // Nếu popup bị tràn trái, dịch sang phải
        if (left < 12) left = 12;

        // Nếu popup bị tràn lên trên, đặt xuống dưới bubble
        if (top < 12) {
            top = bubbleRect.bottom + 12;
        }
        // Nếu popup bị tràn dưới, đẩy lên trên
        if (top + this.popup.offsetHeight > window.innerHeight) {
            top = window.innerHeight - this.popup.offsetHeight - 12;
        }

        this.popup.style.left = left + 'px';
        this.popup.style.top = top + 'px';
        this.popup.style.position = 'fixed';
        this.popup.style.right = 'unset';
        this.popup.style.bottom = 'unset';
    }

    renderAudioPlayer() {
        this.popup.innerHTML = `
            <div class="webm-bottom-buttons-container">
                <div class="music-controls-main">
                    <div class="volume-slider-container" style="display: none;">
                        <input class="volume-slider" type="range" min="0" max="100">
                        <div class="mute-unmute-button">
                            <img class="mute-unmute-icon" src="assets/images/audio.png">
                        </div>
                    </div>
                    <div class="audio-name-bar">
                        <p id="audio-name">Paused: <br>None </p>
                    </div>
                    <div class="music-controls">
                        <div id="mute-audio">
                            <img class="mute-audio-icon" src="assets/images/audio.png">
                        </div>
                        <div id="prev-audio">
                            <img class="prev-audio-icon" src="assets/images/prev-audio.png">
                        </div>
                        <div id="pause-audio">
                            <img class="pause-audio-icon" src="assets/images/play_button.png">
                        </div>
                        <div id="next-audio">
                            <img class="next-audio-icon" src="assets/images/next-audio.png">
                        </div>
                        <div id="audio-loop">
                            <img class="audio-loop-icon" src="assets/images/unrotating-arrow.png">
                        </div>
                    </div>
                </div>
                <div class="theme-audio-progress-bar">
                    <div class="progress-status"></div>
                </div>
            </div>
        `;
    }

    setupAudioBubble() {
        this.setupDrag();
        this.setupTouchDrag();
        this.setupToggle();
        this.setupOutsideClick();
        this.setupPopupPosition();
        this.renderAudioPlayer();
    }
}

export { AudioBubble }