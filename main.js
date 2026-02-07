const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        resizable: false,
        maximizable: false,
        title: 'Stoic Focus',
        frame: false,            // Frameless for custom look
        transparent: true,       // Required for vibrancy
        vibrancy: 'sidebar',     // The "Frosted Glass" effect (macos only)
        visualEffectState: 'active',
        titleBarStyle: 'hiddenInset'
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
