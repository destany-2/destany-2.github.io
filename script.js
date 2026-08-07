// Local MP3 Player for iPod
// Streaming from GitHub Pages
var BASE_URL = 'https://destany-2.github.io/Audio/';

var playlist = [
    { title: "Longing To Be Somebody Else", artist: "AvapXia", bpm: 80, file: BASE_URL + "AvapXia%20-%20longing%20to%20be%20somebody%20else.mp3" },
    { title: "Summer Sunset", artist: "AvapXia", bpm: 90, file: BASE_URL + "AvapXia%20-%20summer%20sunset.mp3" },
    { title: "Creature Comforts", artist: "HoliznaCC0", bpm: 85, file: BASE_URL + "HoliznaCC0%20-%20Creature%20Comforts.mp3" },
    { title: "Whatever", artist: "HoliznaCC0", bpm: 95, file: BASE_URL + "HoliznaCC0%20-%20Whatever.mp3" },
    { title: "Analog", artist: "Lo-Fi Astronaut", bpm: 75, file: BASE_URL + "Lo-Fi%20Astronaut%20-%20Analog%20(%20LoFi%20%2C%20Hopeful%20).mp3" },
    { title: "Artificial Rain", artist: "Lo-Fi Astronaut", bpm: 70, file: BASE_URL + "Lo-Fi%20Astronaut%20-%20Artificial%20Rain%20(%20LoF%20i%2C%20Chill%20).mp3" },
    { title: "Phasing", artist: "Lo-Fi Astronaut", bpm: 80, file: BASE_URL + "Lo-Fi%20Astronaut%20-%20Phasing%20(%20LoFi%20%2C%20Peaceful%20).mp3" },
    { title: "The Grey Room", artist: "On The Flip", bpm: 85, file: BASE_URL + "On%20The%20Flip%20-%20The%20Grey%20Room%20_%20Density%20%26%20Time.mp3" },
];

var currentTrackIndex = 0;
var audio = new Audio();
var isPlaying = false;
var failCount = 0;
var MAX_FAILS = 3;

// DOM elements
var heroPlayBtn = document.getElementById('hero-play-btn');
var heroSongTitle = document.querySelector('.ipod-song-title');
var heroArtist = document.querySelector('.ipod-artist');
var heroAlbumArt = document.querySelector('.ipod-album-art');
var progressBar = document.querySelector('.ipod-progress-bar');
var ipodHint = document.getElementById('ipod-hint');
var timeCurrent = document.querySelector('.ipod-time-current');
var timeRemaining = document.querySelector('.ipod-time-remaining');
var trackNumber = document.querySelector('.ipod-track-number');
var dancingCat = document.getElementById('dancing-cat');
var earbuds = document.getElementById('earbuds');

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function setCatSpeed(bpm) {
    if (dancingCat) {
        var duration = 60 / bpm;
        dancingCat.style.animationDuration = duration + 's';
    }
}

function plugInEarbuds() {
    if (earbuds) {
        earbuds.classList.add('plugged-in');
    }
}

function unplugEarbuds() {
    if (earbuds) {
        earbuds.classList.remove('plugged-in');
    }
}

function updateDisplay() {
    if (playlist.length === 0) {
        heroSongTitle.textContent = 'No tracks';
        heroArtist.textContent = 'Add MP3s';
        return;
    }
    var track = playlist[currentTrackIndex];
    var name = track.title.length > 18
        ? track.title.substring(0, 18) + '...'
        : track.title;
    heroSongTitle.textContent = name;
    heroArtist.textContent = track.artist || '';
    if (trackNumber) trackNumber.textContent = (currentTrackIndex + 1) + ' of ' + playlist.length;
}

function playTrack() {
    if (playlist.length === 0) return;
    if (ipodHint) ipodHint.classList.add('hidden');
    var track = playlist[currentTrackIndex];
    audio.src = track.file;
    audio.play().then(function() {
        isPlaying = true;
        failCount = 0;
        heroPlayBtn.textContent = '\u23F8';
        heroAlbumArt.textContent = '\u266B';
        // Plug in earbuds animation
        plugInEarbuds();
        // Show dancing cat with fade in
        if (dancingCat) {
            dancingCat.classList.add('visible');
            setCatSpeed(track.bpm || 80);
        }
    }).catch(function(err) {
        console.log('Playback failed:', err);
        failCount++;
        if (failCount < MAX_FAILS) {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            updateDisplay();
            playTrack();
        } else {
            heroSongTitle.textContent = 'Unable to play';
            heroArtist.textContent = 'Try again later';
            isPlaying = false;
            failCount = 0;
        }
    });
}

function pauseTrack() {
    audio.pause();
    isPlaying = false;
    heroPlayBtn.textContent = '\u25B6';
    heroAlbumArt.textContent = '\u266A';
    // Unplug earbuds
    unplugEarbuds();
    // Hide dancing cat with fade out
    if (dancingCat) dancingCat.classList.remove('visible');
}

function togglePlay(e) {
    e.preventDefault();
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function skipNext(e) {
    if (e) e.preventDefault();
    if (playlist.length === 0) return;
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    updateDisplay();
    if (isPlaying) {
        playTrack();
    }
}

function skipPrev(e) {
    if (e) e.preventDefault();
    if (playlist.length === 0) return;
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    updateDisplay();
    if (isPlaying) {
        playTrack();
    }
}

// When a track ends, auto-play the next one
audio.addEventListener('ended', function() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    updateDisplay();
    playTrack();
});

// Update progress bar and time display
audio.addEventListener('timeupdate', function() {
    if (audio.duration && progressBar) {
        var percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percent + '%';
    }
    if (timeCurrent) {
        timeCurrent.textContent = formatTime(audio.currentTime);
    }
    if (timeRemaining && audio.duration) {
        timeRemaining.textContent = '-' + formatTime(audio.duration - audio.currentTime);
    }
});

// Event listeners
heroPlayBtn.addEventListener('click', togglePlay);

// Skip forward button
var skipBtn = document.getElementById('skip-btn');
if (skipBtn) {
    skipBtn.addEventListener('click', function(e) {
        e.preventDefault();
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        updateDisplay();
        if (isPlaying) {
            playTrack();
        }
    });
}

// Previous button
var prevBtn = document.getElementById('prev-btn');
if (prevBtn) {
    prevBtn.addEventListener('click', skipPrev);
}

// Smooth scroll for navigation (only for hash links)
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Initial display
updateDisplay();
