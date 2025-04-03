const sounds = {
    'Q': 'data:audio/wav;base64,UklGRnQAAABXQVZFZm10IBAAAAAAfAAEAIAAAAAAAAAAAAAPqAAAAgAAO0xFRnQAAAAmDgYAAAAAAAAA7sAAAAA=',
    'W': 'data:audio/wav;base64,UklGRmYAAABXQVZFZm10IBAAAAAAfAAEAIAAAAAAAAAAAAAPqAAAAgAAO0xFRmYAAAAmDgYAAAAAAAAA7sAAAAA=',
    'E': 'data:audio/wav;base64,UklGRnUAAABXQVZFZm10IBAAAAAAfAAEAIAAAAAAAAAAAAAPqAAAAgAAO0xFRnUAAAAmDgYAAAAAAAAA7sAAAAA=',
    'R': 'data:audio/wav;base64,UklGRtIAAABXQVZFZm10IBAAAAAAfAAEAIAAAAAAAAAAAAAPqAAAAgAAO0xFRtIAAAAmDgYAAAAAAAAA7sAAAAA=',
    'A': 'data:audio/wav;base64,UklGRr0AAABXQVZFZm10IBAAAAAAfAAEAIAAAAAAAAAAAAAPqAAAAgAAO0xFRr0AAAAmDgYAAAAAAAAA7sAAAAA=',
    'S': 'data:audio/wav;base64,UklGRtIAAABXQVZFZm10IBAAAAAAfAAEAIAAAAAAAAAAAAAPqAAAAgAAO0xFRtIAAAmDgYAAAAAAAAA7sAAAAA=',
    'D': 'data:audio/wav;base64,UklGRqkAAABXQVZFZm10IBAAAAAAfAAEAIAAAAAAAAAAAAAPqAAAAgAAO0xFRqkAAAAmDgYAAAAAAAAA7sAAAAA=',
    'F': 'data:audio/wav;base64,UklGRmwAAABXQVZFZm10IBAAAAAAfAAEAIAAAAAAAAAAAAAPqAAAAgAAO0xFRmwAAAAmDgYAAAAAAAAA7sAAAAA=',
    'Z': 'data:audio/wav;base64,UklGRswAAABXQVZFZm10IBAAAAAAfAAEAIAAAAAAAAAAAAAPqAAAAgAAO0xFRswAAAAmDgYAAAAAAAAA7sAAAAA=',
    'X': 'data:audio/wav;base64,UklGRqkAAABXQVZFZm10IBAAAAAAfAAEAIAAAAAAAAAAAAAPqAAAAgAAO0xFRqkAAAAmDgYAAAAAAAAA7sAAAAA=',
    'C': 'data:audio/wav;base64,UklGRlIAAABXQVZFZm10IBAAAAAAfAAEAIAAAAAAAAAAAAAPqAAAAgAAO0xFRlIAAAmDgYAAAAAAAAA7sAAAAA=',
    'V': 'data:audio/wav;base64,UklGRrQAAABXQVZFZm10IBAAAAAAfAAEAIAAAAAAAAAAAAAPqAAAAgAAO0xFRrQAAAAmDgYAAAAAAAAA7sAAAAA='
};

const keyBindings = { ...sounds };

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let unlocked = false;

function unlockAudio() {
    if (!unlocked) {
        const buffer = audioContext.createBuffer(1, 1, 22050);
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start(0);
        unlocked = true;
    }
}

function playSound(key) {
    let soundData = keyBindings[key];
    if (soundData) {
        const audio = new Audio(soundData);
        audio.play();

        let pad = document.querySelector(`.pad[data-key="${key}"]`);
        if (pad) {
            pad.classList.add("active");
            setTimeout(() => pad.classList.remove("active"), 100);
        }
    }
}

document.addEventListener("keydown", (event) => {
    playSound(event.key.toUpperCase());
});

document.addEventListener("click", unlockAudio); 
document.addEventListener("touchstart", unlockAudio);

const padContainer = document.getElementById("padContainer");
const resetBtn = document.getElementById("resetKeys");

function createPad(key) {
    let pad = document.createElement("div");
    pad.classList.add("pad");
    pad.innerText = key;
    pad.dataset.key = key;
    pad.addEventListener("click", () => {
        unlockAudio();
        playSound(key);
    });
    padContainer.appendChild(pad);
}

Object.keys(keyBindings).forEach(key => createPad(key));

resetBtn.addEventListener("click", () => {
    location.reload();
});
