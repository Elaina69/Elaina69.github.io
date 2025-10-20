import audioList from "../configs/audioList.js"

let paused = 1
let muted = false
let loop = false
let audioIndex = Math.floor(Math.random() * audioList.length)
let audioVolume = 0.1
let bubbleAngle = 0;
let bubbleSpinInterval = null;

window.pausedAudio = paused;
window.mutedAudio = muted;
window.loopAudio = loop;
window.audioIndex = audioIndex;
window.audioVolume = audioVolume;

console.log(audioList)

class AudioController {
    toggleBubbleSpin = () => {
        const bubble = document.querySelector("#audio-bubble img");

        if (!bubble) return;

        if (window.pausedAudio % 2 !== 0) {
            if (!bubbleSpinInterval) {
                bubbleSpinInterval = setInterval(() => {
                    bubbleAngle = (bubbleAngle + 0.4) % 360;
                    bubble.style.transform = `rotate(${bubbleAngle}deg)`;
                }, 16);
            }
        } 
        else {
            if (bubbleSpinInterval) {
                clearInterval(bubbleSpinInterval);
                bubbleSpinInterval = null;
            }
            bubble.style.transform = `rotate(${bubbleAngle}deg)`;
        }
    };

    audioPlayPause = () => {
        const audio = document.getElementById("bg-audio");
        window.pausedAudio % 2 === 0 ? audio.pause() : audio.play();
        this.changeSongName()
        this.toggleBubbleSpin()
    };
    
    playPauseSetIconAudio = (elem = document.querySelector(".pause-audio-icon")) => {
        const pauseAudioIcon = elem;
        if (!pauseAudioIcon) return;
        pauseAudioIcon.setAttribute("src", `assets/images/${pausedAudio % 2 === 0 ? 'play_button' : 'pause_button'}.png`);
    };
    
    audioMute = () => {
        const audio = document.getElementById("bg-audio");
        const isMuted = window.mutedAudio
        audio.muted = isMuted;
    };
    
    muteSetIconAudio = (elem = document.querySelector(".mute-audio-icon")) => {
        const muteAudioIcon = elem;
        if (!muteAudioIcon) return;
        muteAudioIcon.setAttribute("src", `assets/images/${window.mutedAudio ? 'mute.webp' : 'audio.png'}`)
    };
    
    setAudioLoopIcon = (elem = document.querySelector(".audio-loop-icon")) => {
        const iconElement = elem;
        if (!iconElement) return;
        iconElement.setAttribute("src", `assets/images/${window.loopAudio ? 'rotating-arrow' : 'unrotating-arrow'}.webp`);
    };
    
    toggleAudioLoop = () => {
        const audio = document.getElementById("bg-audio");

        function handleAudioEnded() {
            audio.pause();
            audio.load();
        }

        if (window.loopAudio) {
            audio.removeEventListener("ended", this.nextSong);
            audio.addEventListener("ended", handleAudioEnded);
        } 
        else {
            audio.removeEventListener("ended", handleAudioEnded);
            audio.addEventListener("ended", this.nextSong);
            this.changeSongName()
        }
    };
    
    loadSong = (song) => {
        const audio = document.getElementById("bg-audio");
        audio.src = `assets/audio/${song}`;
    };

    updateAudio = async (song) => {
        this.loadSong(song);
        this.audioPlayPause();
        this.changeSongName();
    }
    
    nextSong = async () => {
        window.audioIndex = window.audioIndex + 1;
    
        if (window.audioIndex > audioList.length - 1) {
            window.audioIndex = 0;
        }
        await this.updateAudio(audioList[window.audioIndex]);
    };
    
    prevSong = async () => {
        window.audioIndex = window.audioIndex - 1;
    
        if (window.audioIndex < 0) {
            window.audioIndex = audioList.length - 1;
        }
        await this.updateAudio(audioList[window.audioIndex]);
    };
    
    changeSongName = ()=> {
        let currentSong = audioList[window.audioIndex]
        let songNameText = document.querySelector(".audio-name-bar > p")
        if (songNameText) {
            if (window.pausedAudio % 2 === 0) {
                songNameText.innerHTML = `Paused: <br/>${currentSong}`
            }
            else songNameText.innerHTML = `Now playing: <br/>${currentSong}`
        }
    }
}

const audioController = new AudioController()

class AudioControllers {
    setupControllerListeners() {
        const container = document.querySelector(".webm-bottom-buttons-container");
        const muteAudio = document.querySelector("#mute-audio");
        const pauseAudioIcon = document.querySelector(".pause-audio-icon");
        const muteAudioIcon = document.querySelector(".mute-audio-icon");
        const audioLoopIcon = document.querySelector(".audio-loop-icon");
        const volumeSliderContainer = document.querySelector(".volume-slider-container");
        const volumeSlider = document.querySelector(".volume-slider");
        const muteUnmuteButton = document.querySelector(".mute-unmute-button");
        const muteUnmuteIcon = document.querySelector(".mute-unmute-icon");
        const progress = document.querySelector(".progress-status");
        const audioName = document.querySelector("#audio-name");

        // Set icon audio controller button
        audioController.playPauseSetIconAudio(pauseAudioIcon);
        audioController.muteSetIconAudio(muteAudioIcon);
        audioController.setAudioLoopIcon(audioLoopIcon);

        // Set current audio name to progress bar
        window.pausedAudio % 2 === 0 
            ? audioName.innerHTML = `Paused: <br/>${audioList[window.audioIndex]}`
            : audioName.innerHTML = `Now playing: <br/>${audioList[window.audioIndex]}`

        // Handle volume slider input
        volumeSlider.value = window.audioVolume * 100;

        volumeSlider.addEventListener('input', () => {
            const volumeValue = volumeSlider.value / 100;
            window.audioVolume = volumeValue
            const audio = document.getElementById("bg-audio");
            audio.volume = volumeValue;
    
            if (volumeValue === 0) {
                window.mutedAudio = true;
                audio.muted = true;
                audioController.muteSetIconAudio();
                muteUnmuteIcon.setAttribute("src", `assets/images/mute.webp`);
            } else {
                window.mutedAudio = false;
                audio.muted = false;
                audioController.muteSetIconAudio();
                muteUnmuteIcon.setAttribute("src", `assets/images/audio.png`);
            }
        });

        // Mute/unmute button within the volume slider
        muteUnmuteButton.addEventListener('click', () => {
            const isMuted = !window.mutedAudio;
            window.mutedAudio = isMuted;

            audioController.audioMute();
            audioController.muteSetIconAudio();

            muteUnmuteIcon.setAttribute("src", `assets/images/${isMuted ? 'mute.webp' : 'audio.png'}`);
            const audio = document.getElementById("bg-audio");
            if (isMuted) {
                volumeSlider.value = 0;
                audio.volume = 0;
            } else {
                volumeSlider.value = window.audioVolume * 100;
                audio.volume = window.audioVolume;
            }
        });

        // Show/hide volume slider when clicking mute audio icon
        muteAudio.addEventListener('click', () => {
            if (volumeSliderContainer.style.display === 'flex') {
                volumeSliderContainer.style.display = 'none';
            } else {
                volumeSliderContainer.style.display = 'flex';
            }
        });

        // Optionally hide the slider when clicking elsewhere
        document.addEventListener('click', (event) => {
            if (!muteAudio.contains(event.target) && !volumeSliderContainer.contains(event.target)) {
                volumeSliderContainer.style.display = 'none';
            }
        });

        // Update progress bar
        const audio = document.getElementById('bg-audio');
    
        if (audio) {
            progress.style.width = audio && audio.duration ? `${(audio.currentTime / audio.duration) * 100 + 1}%` : '0%';
            audio.addEventListener('timeupdate', () => {
                progress.style.width = audio.duration ? `${(audio.currentTime / audio.duration) * 100 + 1}%` : '0%';
            });
        }

        // Event delegation for dynamically created elements
        container.addEventListener('click',async (event) => {
            if (event.target.closest('#pause-audio')) {
                window.pausedAudio++;
                audioController.audioPlayPause();
                audioController.playPauseSetIconAudio();
                audioController.changeSongName();
            }
            if (event.target.closest('#next-audio')) {
                await audioController.nextSong();
                audioController.changeSongName();
            }
            if (event.target.closest('#prev-audio')) {
                await audioController.prevSong();
                audioController.changeSongName();
            }
            if (event.target.closest('#audio-loop')) {
                window.loopAudio = !window.loopAudio;
                audioController.toggleAudioLoop();
                audioController.setAudioLoopIcon();
            }
        });

        audioController.toggleBubbleSpin()
    }

    setAudioSrc() {
        audioController.loadSong(audioList[window.audioIndex])

        const audio = document.getElementById("bg-audio");

        audio.volume = window.audioVolume;
        audio.autoplay = true;

        audio.addEventListener("error", () => audio.load());

        audioController.toggleAudioLoop();

        document.addEventListener('click', () => {
            audio.play().catch(() => {});
            audioController.toggleBubbleSpin();
        }, { once: true });
    }
}

export { AudioControllers }