const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

// Farben
const colors = [
    null,
    '#FF0D72', // T
    '#0DC2FF', // O
    '#0DFF72', // L
    '#F538FF', // J
    '#FF8E0D', // I
    '#FFE138', // S
    '#3877FF', // Z
];

// --- AUDIO SYSTEM (Synthesizer & Musik) ---
let soundEnabled = true;
const bgMusic = document.getElementById('bg-music');
let audioCtx = null; // Wird beim ersten User-Klick initialisiert

// Erzeugt einen Retro-Piepton (Synthesizer)
function playTone(freq, type, duration) {
    if (!soundEnabled) return;
    
    // AudioContext erst beim ersten Ton starten (Browser-Policy)
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type; // 'square', 'sawtooth', 'triangle', 'sine'
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    // Lautstärke: kurz ansteigen, dann ausfaden
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// Vorgefertigte Sound-Effekte
const Sounds = {
    move: () => playTone(300, 'square', 0.05),
    rotate: () => playTone(500, 'square', 0.05),
    drop: () => playTone(150, 'sawtooth', 0.1),
    clear: () => {
        // Kleiner Jingle bei Reihe voll
        playTone(600, 'square', 0.1);
        setTimeout(() => playTone(800, 'square', 0.1), 100);
        setTimeout(() => playTone(1200, 'square', 0.2), 200);
    }
};

function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('btn-sound');
    
    if (soundEnabled) {
        btn.innerText = "🔊 An";
        // Versuchen Musik zu starten
        if (bgMusic) bgMusic.play().catch(e => console.log("Autoplay blockiert:", e));
    } else {
        btn.innerText = "🔇 Aus";
        if (bgMusic) bgMusic.pause();
    }
}

// --- Hilfsfunktionen ---

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type) {
    if (type === 'I') return [[0, 1, 0, 0],[0, 1, 0, 0],[0, 1, 0, 0],[0, 1, 0, 0]];
    if (type === 'L') return [[0, 2, 0],[0, 2, 0],[0, 2, 2]];
    if (type === 'J') return [[0, 3, 0],[0, 3, 0],[3, 3, 0]];
    if (type === 'O') return [[4, 4],[4, 4]];
    if (type === 'Z') return [[5, 5, 0],[0, 5, 5],[0, 0, 0]];
    if (type === 'S') return [[0, 6, 6],[6, 6, 0],[0, 0, 0]];
    if (type === 'T') return [[0, 7, 0],[7, 7, 7],[0, 0, 0]];
}

// --- Spiel Logik ---

function arenaSweep() {
    let rowCount = 1;
    let swept = false;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
        swept = true;
    }
    if (swept) Sounds.clear(); // SOUND
}

function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (dir > 0) matrix.forEach(row => row.reverse());
    else matrix.reverse();
}

// --- Spieler Aktionen ---

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        Sounds.drop(); // SOUND: Aufschlag
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(offset) {
    player.pos.x += offset;
    if (collide(arena, player)) {
        player.pos.x -= offset;
    } else {
        Sounds.move(); // SOUND: Bewegung
    }
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
                   (player.matrix[0].length / 2 | 0);

    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
    Sounds.rotate(); // SOUND: Drehung erfolgreich
}

// --- Game Control (Pause / Reset) ---

let isPaused = false;
let animationId = null;

function resetGame() {
    // Initialisiere Audio Kontext beim ersten Reset/Start (User Interaktion notwendig)
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if(soundEnabled && bgMusic) bgMusic.play().catch(e => {});
    }

    arena.forEach(row => row.fill(0));
    player.score = 0;
    updateScore();
    playerReset();
    if (isPaused) {
        isPaused = false;
        update();
        document.getElementById('btn-pause').innerText = "Pause";
    }
}

function togglePause() {
    if (isPaused) {
        isPaused = false;
        update();
        document.getElementById('btn-pause').innerText = "Pause";
        if (soundEnabled && bgMusic) bgMusic.play();
    } else {
        isPaused = true;
        cancelAnimationFrame(animationId);
        
        // Pause Screen zeichnen
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#fff';
        context.font = '1px Arial';
        context.fillText("PAUSE", 4.5, 9);
        
        document.getElementById('btn-pause').innerText = "Weiter";
        if (bgMusic) bgMusic.pause();
    }
}

// --- Game Loop ---

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
    if (isPaused) return;

    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    draw();
    animationId = requestAnimationFrame(update);
}

function updateScore() {
    document.getElementById('score').innerText = 'Punkte: ' + player.score;
}

// --- Init & Events ---

const arena = createMatrix(12, 20);

const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
};

// Tastatur
document.addEventListener('keydown', event => {
    if (isPaused) return; 
    
    // Audio Start Hack: Browser erlauben Audio oft erst nach der ersten Taste
    if (!audioCtx && soundEnabled) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if(bgMusic) bgMusic.play().catch(e => {});
    }

    if (event.keyCode === 37) {
        playerMove(-1);
    } else if (event.keyCode === 39) {
        playerMove(1);
    } else if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 81) {
        playerRotate(-1);
    } else if (event.keyCode === 87 || event.keyCode === 38) {
        playerRotate(1);
    }
});

// Buttons
document.getElementById('btn-reset').addEventListener('click', resetGame);
document.getElementById('btn-pause').addEventListener('click', togglePause);
document.getElementById('btn-sound').addEventListener('click', toggleSound);

// Touch Controls
function addTouchListener(id, action) {
    const btn = document.getElementById(id);
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        
        // Audio Start für Mobile
        if (!audioCtx && soundEnabled) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if(bgMusic) bgMusic.play().catch(e => {});
        }

        if (!isPaused) action();
    });
    btn.addEventListener('click', (e) => {
        if (!isPaused) action();
    });
}

addTouchListener('t-left', () => playerMove(-1));
addTouchListener('t-right', () => playerMove(1));
addTouchListener('t-down', () => playerDrop());
addTouchListener('t-rotate', () => playerRotate(1));

// Start
playerReset();
updateScore();
update();
