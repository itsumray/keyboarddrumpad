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
                const source = audio
