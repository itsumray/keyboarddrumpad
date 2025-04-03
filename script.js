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

// Play sound when a key is pressed
document.addEventListener("keydown", (event) => {
    let key = event.key.toUpperCase();
    if (sounds[key]) {
        new Audio(sounds[key]).play();
    }
});
