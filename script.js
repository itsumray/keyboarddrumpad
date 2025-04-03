const defaultSounds = {
    'Q': 'sounds/kick.wav',  'W': 'sounds/snare.wav',  'E': 'sounds/hihat-closed.wav',
    'R': 'sounds/hihat-open.wav',  'A': 'sounds/tom1.wav',  'S': 'sounds/tom2.wav',
    'D': 'sounds/tom3.wav',  'F': 'sounds/crash.wav',  'Z': 'sounds/ride.wav',
    'X': 'sounds/cowbell.wav',  'C': 'sounds/clap.wav',  'V': 'sounds/percussion.wav'
};

// Load keybinds from storage or use default
let keyBindings = JSON.parse(localStorage.getItem("keyBindings")) || { ...defaultSounds };

// Web Audio API to fix iOS sound issues
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let unlocked = false;

// Unlock audio context on first touch
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

// Play sound function (iOS Fix)
function playSound(key) {
    let soundPath = keyBindings[key];
    if (soundPath) {
        fetch(soundPath)
            .then(response => response.arrayBuffer())
            .then(data => audioContext.decodeAudioData(data))
            .then(buffer => {
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.destination);
                source.start(0);
            });

        let pad = document.querySelector(`.pad[data-key="${key}"]`);
        if (pad) {
            pad.classList.add("active");
            setTimeout(() => pad.classList.remove("active"), 100);
        }
    }
}

// Update the key-sound info
function updateKeyInfo() {
    const keyInfoList = document.getElementById('keyInfoList');
    keyInfoList.innerHTML = '';  // Clear current list
    for (let key in keyBindings) {
        let listItem = document.createElement('li');
        listItem.textContent = `${key}: ${keyBindings[key]}`;
        keyInfoList.appendChild(listItem);
    }
}

// Play sound when key is pressed
document.addEventListener("keydown", (event) => {
    playSound(event.key.toUpperCase());
});

// Play sound when clicking a pad
document.addEventListener("click", unlockAudio); // Unlock sound for iOS
document.addEventListener("touchstart", unlockAudio); // Fix for iPhones/iPads

const padContainer = document.getElementById("padContainer");
const resetBtn = document.getElementById("resetKeys");
let waitingForKey = null;

// Create a drum pad
function createPad(key, sound) {
    let pad = document.createElement("div");
    pad.classList.add("pad");
    pad.innerText = key;
    pad.dataset.key = key;
    pad.addEventListener("click", () => {
        unlockAudio();
        playSound(key);
        reassignKey(pad);
    });
    padContainer.appendChild(pad);
}

// Reassign key function
function reassignKey(pad) {
    waitingForKey = pad;
    pad.innerText = "Press Key...";
}

// Listen for new key assignment
document.addEventListener("keydown", (event) => {
    if (waitingForKey) {
        let newKey = event.key.toUpperCase();
        let oldKey = waitingForKey.dataset.key;

        keyBindings[newKey] = keyBindings[oldKey];
        delete keyBindings[oldKey];

        localStorage.setItem("keyBindings", JSON.stringify(keyBindings));

        waitingForKey.innerText = newKey;
        waitingForKey.dataset.key = newKey;
        waitingForKey = null;
    }
});

// Reset keybindings
resetBtn.addEventListener("click", () => {
    localStorage.removeItem("keyBindings");
    location.reload();
});

// Create pads and update sound info
Object.keys(keyBindings).forEach(key => createPad(key, keyBindings[key]));
updateKeyInfo();
