const defaultSounds = {
    'Q': 'sounds/kick.wav',
    'W': 'sounds/snare.wav',
    'E': 'sounds/hihat-closed.wav',
    'R': 'sounds/hihat-open.wav',
    'A': 'sounds/tom1.wav',
    'S': 'sounds/tom2.wav',
    'D': 'sounds/tom3.wav',
    'F': 'sounds/crash.wav',
    'Z': 'sounds/ride.wav',
    'X': 'sounds/cowbell.wav',
    'C': 'sounds/clap.wav',
    'V': 'sounds/percussion.wav'
};

// Load keybinds from local storage or use defaults
let keyBindings = JSON.parse(localStorage.getItem("keyBindings")) || { ...defaultSounds };

const padContainer = document.getElementById("padContainer");
const resetBtn = document.getElementById("resetKeys");
let waitingForKey = null;

// Create drum pads
Object.keys(keyBindings).forEach(key => createPad(key, keyBindings[key]));

// Play sound function
function playSound(key) {
    if (keyBindings[key]) {
        const audio = new Audio(keyBindings[key]);
        audio.play();
        
        // Highlight pad
        const pad = document.querySelector(`.pad[data-key="${key}"]`);
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

// Create a drum pad
function createPad(key, sound) {
    const pad = document.createElement("div");
    pad.classList.add("pad");
    pad.innerText = key;
    pad.dataset.key = key;
    pad.addEventListener("click", () => reassignKey(pad));
    padContainer.appendChild(pad);
}

// Reassign key function
function reassignKey(pad) {
    waitingForKey = pad;
    pad.innerText = "Press Key";
}

// Listen for new key assignment
document.addEventListener("keydown", (event) => {
    if (waitingForKey) {
        let newKey = event.key.toUpperCase();
        let oldKey = waitingForKey.dataset.key;

        // Update keyBindings
        keyBindings[newKey] = keyBindings[oldKey];
        delete keyBindings[oldKey];

        // Save to local storage
        localStorage.setItem("keyBindings", JSON.stringify(keyBindings));

        // Update pad
        waitingForKey.innerText = newKey;
        waitingForKey.dataset.key = newKey;
        waitingForKey = null;
    }
});

// Reset to default keybindings
resetBtn.addEventListener("click", () => {
    localStorage.removeItem("keyBindings");
    location.reload();
});
