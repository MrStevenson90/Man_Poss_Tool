let matchTime = 0;
let timer = null;
let possessionStart = { LP: null, RM: null };
let totalPossession = { LP: 0, RM: 0 };

function formatTime(seconds) {
    let m = Math.floor(seconds / 60);
    let s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateMatchClock() {
    document.getElementById('matchClock').textContent = formatTime(matchTime);
    // Check if a new minute has started, including the 0th second of the match
    if (matchTime % 60 === 0) {
        resetPossession(); // Reset possession statistics
        updatePossessionBar(); // Update UI to reflect the reset
    }
    matchTime++;
}

function startClock() {
    if (!timer) {
        timer = setInterval(() => {
            updateMatchClock();
            updatePossessionTimes();
            updatePossessionBar();
        }, 1000);
    }
}

function stopClock() {
    if (timer) {
        clearInterval(timer);
        timer = null;
        updatePossessionTimes(); // Update possession one last time when the clock stops
        updatePossessionBar();
    }
}

function adjustTime(delta) {
    matchTime += delta;
    if (matchTime < 0) matchTime = 0;
    updateMatchClock();
    updatePossessionTimes();
    updatePossessionBar();
}

function recordPossession(team) {
    updatePossessionTimes(); // Update possession before switching teams
    if (possessionStart[team] === null) {
        // Start new possession
        possessionStart[team] = matchTime;
    } else {
        // End current possession and update total
        totalPossession[team] += matchTime - possessionStart[team];
        possessionStart[team] = null;
    }
    updatePossessionBar();
}

function updatePossessionTimes() {
    // Calculate ongoing possession for each team
    for (let team in possessionStart) {
        if (possessionStart[team] !== null) {
            totalPossession[team] += matchTime - possessionStart[team];
            possessionStart[team] = matchTime;
        }
    }
}

function updatePossessionBar() {
    const totalTime = Math.max(matchTime % 60, 1); // Use match time of the current minute
    const lpPercent = (totalPossession.LP / totalTime) * 100;
    const rmPercent = (totalPossession.RM / totalTime) * 100;
    document.getElementById('possessionLP').style.width = `${lpPercent}%`;
    document.getElementById('possessionRM').style.width = `${100 - lpPercent}%`; // Ensure total is 100%
    document.getElementById('possessionLPText').textContent = `LP: ${lpPercent.toFixed(2)}%`;
    document.getElementById('possessionRMText').textContent = `RM: ${(100 - lpPercent).toFixed(2)}%`;
}

function resetPossession() {
    // Reset possession data
    totalPossession.LP = 0;
    totalPossession.RM = 0;
    possessionStart.LP = null;
    possessionStart.RM = null;

    // Update UI to show 50/50 possession
    document.getElementById('possessionLP').style.width = '50%';
    document.getElementById('possessionRM').style.width = '50%';
    document.getElementById('possessionLPText').textContent = 'LP: 50.00%';
    document.getElementById('possessionRMText').textContent = 'RM: 50.00%';
}

document.getElementById('btnStart').addEventListener('click', startClock);
document.getElementById('btnStop').addEventListener('click', stopClock);
document.getElementById('btnUp').addEventListener('click', () => adjustTime(1));
document.getElementById('btnDown').addEventListener('click', () => adjustTime(-1));
document.getElementById('teamLP').addEventListener('click', () => recordPossession('LP'));
document.getElementById('teamRM').addEventListener('click', () => recordPossession('RM'));

window.onload = updateMatchClock;
