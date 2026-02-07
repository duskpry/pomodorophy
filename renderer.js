const fs = require('fs');
const path = require('path');

class StoicTimer {
    constructor() {
        // DOM Elements
        this.timeDisplay = document.getElementById('time-display');
        this.circle = document.querySelector('.progress-ring__circle');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.settingsBtn = document.getElementById('settings-btn');
        this.modeLabel = document.getElementById('mode-label');
        this.appTitle = document.getElementById('app-title');

        // Dynamic Island Elements
        this.dynamicIsland = document.querySelector('.dynamic-island');
        this.settingsPanel = document.getElementById('settings-panel');

        // Icons
        this.playIcon = document.getElementById('play-icon');
        this.pauseIconLeft = document.getElementById('pause-icon-left');
        this.pauseIconRight = document.getElementById('pause-icon-right');

        this.inputs = {
            focus: document.getElementById('focus-duration'),
            break: document.getElementById('break-duration'),
            intervals: document.getElementById('intervals')
        };

        this.quoteContainer = document.getElementById('quote-container');
        this.quoteText = document.getElementById('quote-text');
        this.quoteAuthor = document.getElementById('quote-author');
        this.closeQuoteBtn = document.getElementById('close-quote');

        // State
        this.isRunning = false;
        this.timeLeft = 25 * 60;
        this.totalTime = 25 * 60;
        this.intervalId = null;
        this.currentInterval = 1;
        this.isBreak = false;
        this.circumference = 2 * Math.PI * 130;

        // Sound Context
        this.audioCtx = null;

        this.init();
    }

    init() {
        // Setup Circle
        this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.circle.style.strokeDashoffset = 0;

        // Event Listeners
        this.startBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.settingsBtn.addEventListener('click', () => this.toggleSettings());
        this.closeQuoteBtn.addEventListener('click', () => this.hideQuote());

        // Input listeners
        Object.values(this.inputs).forEach(input => {
            input.addEventListener('input', () => this.handleInputChange());
        });

        this.updateSettings(); // Initial load
    }

    toggleSettings() {
        this.dynamicIsland.classList.toggle('expanded');
    }

    handleInputChange() {
        if (!this.isRunning) {
            // Only update time if we are in the corresponding mode
            // Since we always reset to Focus, we mostly care about focus updates
            if (!this.isBreak) {
                const focusMin = parseInt(this.inputs.focus.value) || 25;
                this.totalTime = focusMin * 60;
                this.timeLeft = this.totalTime;
            } else {
                const breakMin = parseInt(this.inputs.break.value) || 5;
                this.totalTime = breakMin * 60;
                this.timeLeft = this.totalTime;
            }
            this.updateDisplay();
            this.updateProgress(1);
        }
    }

    updateSettings() {
        if (this.isRunning) return;

        const focusMin = parseInt(this.inputs.focus.value) || 25;
        this.totalTime = focusMin * 60;
        this.timeLeft = this.totalTime;
        this.updateDisplay();
        this.updateProgress(1);
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }

    updatePlayIcon(playing) {
        if (playing) {
            this.playIcon.classList.add('hidden');
            this.pauseIconLeft.classList.remove('hidden');
            this.pauseIconRight.classList.remove('hidden');
        } else {
            this.playIcon.classList.remove('hidden');
            this.pauseIconLeft.classList.add('hidden');
            this.pauseIconRight.classList.add('hidden');
        }
    }

    start() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }

        this.isRunning = true;
        this.updatePlayIcon(true);
        if (this.appTitle) this.appTitle.classList.add('fade-out');

        // Collapse settings on start
        this.dynamicIsland.classList.remove('expanded');

        // Disable inputs while running
        Object.values(this.inputs).forEach(input => input.disabled = true);

        this.intervalId = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            const progress = this.timeLeft / this.totalTime;
            this.updateProgress(progress);

            if (this.timeLeft <= 0) {
                this.complete();
            }
        }, 1000);
    }

    pause() {
        this.isRunning = false;
        this.updatePlayIcon(false);
        if (this.appTitle) this.appTitle.classList.remove('fade-out');
        clearInterval(this.intervalId);

        // Enable inputs when paused
        Object.values(this.inputs).forEach(input => input.disabled = false);
    }

    resetTimer() {
        this.pause();
        this.isBreak = false;
        this.currentInterval = 1;
        this.modeLabel.textContent = 'Focus';
        this.circle.style.stroke = '#ffffff';
        this.updateSettings();
    }

    complete() {
        this.pause();
        this.playSound();

        // Show Quote Overlay
        this.showQuote();

        // LOGIC FIX: User wants to reset to configured timer (Focus) behind the quote.
        // We do NOT go effectively into break mode unless they manually start it?
        // Or we just prep the focus time again.

        // Resetting to FOCUS time as requested.
        const focusMin = parseInt(this.inputs.focus.value) || 25;
        this.timeLeft = focusMin * 60;
        this.totalTime = this.timeLeft;
        this.isBreak = false; // Ensure we are back in focus mode logic
        this.modeLabel.textContent = 'Focus';
        this.circle.style.stroke = '#ffffff';

        this.updateDisplay();
        this.updateProgress(1);
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    updateProgress(percent) {
        const offset = this.circumference - (percent * this.circumference);
        this.circle.style.strokeDashoffset = offset;
    }

    showQuote() {
        try {
            const quotesPath = path.join(__dirname, 'quotes.json');
            const quotesData = fs.readFileSync(quotesPath, 'utf-8');
            const quotes = JSON.parse(quotesData);

            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

            this.quoteText.textContent = `"${randomQuote.text}"`;
            this.quoteAuthor.textContent = `${randomQuote.author}`;

            this.quoteContainer.classList.add('visible');
        } catch (e) {
            console.error('Error fetching quotes:', e);
            this.quoteText.textContent = "Focus on the present moment.";
            this.quoteAuthor.textContent = "Stoic Wisdom";
            this.quoteContainer.classList.add('visible');
        }
    }

    hideQuote() {
        this.quoteContainer.classList.remove('visible');
    }

    playSound() {
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, this.audioCtx.currentTime + 2);

        gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.8, this.audioCtx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 4);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 4);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new StoicTimer();
});
