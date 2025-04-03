const defaultSounds = {
    'Q': 'sounds/kick.wav',  'W': 'sounds/snare.wav',  'E': 'sounds/hihat-closed.wav',
    'R': 'sounds/hihat-open.wav',  'T': 'sounds/tom1.wav',  'Y': 'sounds/tom2.wav',
    'A': 'sounds/tom3.wav',  'S': 'sounds/crash.wav',  'D': 'sounds/ride.wav',
    'F': 'sounds/cowbell.wav',  'G': 'sounds/clap.wav',  'H': 'sounds/percussion.wav',
    'Z': 'sounds/bass.wav',  'X': 'sounds/conga.wav',  'C': 'sounds/shaker.wav',
    'V': 'sounds/triangle.wav',  'B': 'sounds/snap.wav',  'N': 'sounds/woodblock.wav',
    '1': 'sounds/synth1.wav',  '2': 'sounds/synth2.wav',  '3': 'sounds/synth3.wav',
    '4': 'sounds/synth4.wav',  '5': 'sounds/synth5.wav',  '6': 'sounds/synth6.wav'
};

// Load keybinds from storage or use default
let keyBindings = JSON.parse(localStorage.getItem("keyBindings")) || { ...defaultSounds };

const padContainer = document.getElementById("padContainer");
const resetBtn = document.getElementById("resetKeys");
let waitingForKey = null;

// Create drum pads
Object.keys(keyBindings).forEach(key => createPad(key, keyBindings[key]));

// Function to play sound
function playSound(key) {
    let soundPath = keyBindings[key];
    if (soundPath) {
        let audio = new Audio(soundPath);
        audio.play();

        let pad = document.querySelector(`.pad[data-key="${key}"]`);
        if (pad) {
            pad.classList.add("active");
            setTimeout(() => pad.classList.remove("active"), 100);
        }
    }
}

// Play sound when key is pressed
document.addEventListener("keydown", (event) => {
    playSound(event.key.toUpperCase());
});

// Function to create a drum pad
function createPad(key, sound) {
    let pad = document.createElement("div");
    pad.classList.add("pad");
    pad.innerText = key;
    pad.dataset.key = key;
    pad.addEventListener("click", () => reassignKey(pad));
    padContainer.appendChild(pad);
}

// Change keybind function
function reassignKey(pad) {
    waitingForKey = pad;
    pad.innerText = "Press Key...";
}

// Listen for new key assignment
document.addEventListener("keydown", (event) => {
    if (waitingForKey) {
        let newKey = event.key.toUpperCase();
        let oldKey = waitingForKey.dataset.key;

        // Update keyBindings
        keyBindings[newKey] = keyBindings[oldKey];
        delete keyBindings[oldKey];

        // Save new bindings
        localStorage.setItem("keyBindings", JSON.stringify(keyBindings));

        // Update pad UI
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
