# Stoic Focus (Pomodorophy)

A minimalist, ultra-distraction-free Pomodoro timer designed for deep work and Stoic reflection.

## Design Philosophy

- **Use "Warm Stone" & "Deep Black"**: The interface is designed to be calm and grounding.
- **Steve Jobs Minimalism**: No containers, no borders, no unnecessary UI. Controls float in space.
- **Stoic Wisdom**: Each session ends with a curated Stoic quote to prompt reflection before your break.

## Features

- **Floating Controls**: A "Dynamic Island" style control bar that fades away when not in use.
- **Focus First**: The app resets to your configured Focus time after every cycle, prioritizing work over breaks.
- **Native Feel**: Built with Electron for a seamless macOS experience.
- **Privacy Focused**: No data collection, completely local.

## How to Run

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:duskpry/pomodorophy.git
    cd pomodorophy
    ```

2.  **Start the App:**
    Use the included script to install dependencies (locally) and launch:
    ```bash
    ./start_app.sh
    ```

## Development

- `main.js`: Electron main process (Window management).
- `renderer.js`: Frontend logic (Timer, Sound, Quotes).
- `style.css`: The "Steve Jobs" minimalist stylesheet.
