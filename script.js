const sounds = {
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

const padContainer = document.getElementById("padContainer");
const recordBtn = document.getElementById("recordBtn");
const playBtn = document.getElementById("playBtn");
const exportBtn = document.getElementById("exportBtn");
const bpmInput = document.getElementById("bpm");
const startMetronome = document.getElementById("startMetronome");
const stopMetronome = document.getElementById("stopMetronome");

let isRecording = false;
let recordedNotes = [];
let metronomeInterval = null;

// Create drum pads
Object.keys(sounds).forEach(key => {
    const pad = document.createElement("div");
    pad.classList.add("pad");
    pad.innerText = key;
    pad.dataset.key = key;
    pad.addEventListener("click", () => playSound(key));
    padContainer.appendChild(pad);
});

// Play sound function
function playSound(key) {
    if (sounds[key]) {
        const audio = new Audio(sounds[key]);
        audio.play();
        
        // Add to recording if recording is active
        if (isRecording) {
            recordedNotes.push({ key, time: Date.now() });
        }

        // Highlight pad
        const pad = document.querySelector(`.pad[data-key="${key}"]`);
        if (pad) {
            pad.classList.add("active");
            setTimeout(() => pad.classList.remove("active"), 100);
        }
    }
}

// Keydown event listener
document.addEventListener("keydown", (event) => {
    playSound(event.key.toUpperCase());
});

// Recording logic
recordBtn.addEventListener("click", () => {
    isRecording = !isRecording;
    recordedNotes = [];
    recordBtn.innerText = isRecording ? "Recording..." : "Record";
});

playBtn.addEventListener("click", () => {
    if (recordedNotes.length === 0) return;

    let startTime = recordedNotes[0].time;
    recordedNotes.forEach(note => {
        setTimeout(() => playSound(note.key), note.time - startTime);
    });
});

// Export recording
exportBtn.addEventListener("click", () => {
    if (recordedNotes.length === 0) return;

    const data = JSON.stringify(recordedNotes);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "recording.json";
    a.click();
    
    URL.revokeObjectURL(url);
});

// Metronome logic
function
