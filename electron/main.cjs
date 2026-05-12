const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;
let detectionInterval;

// List of known players
const KNOWN_PLAYERS = [
  { name: 'Spotify', exe: 'spotify.exe' },
  { name: 'VLC', exe: 'vlc.exe' },
  { name: 'Apple Music', exe: 'applemusic.exe' },
  { name: 'Windows Media Player', exe: 'wmplayer.exe' },
  { name: 'foobar2000', exe: 'foobar2000.exe' },
  { name: 'Winamp', exe: 'winamp.exe' },
];

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    x: width - 420, // Bottom right corner
    y: height - 620,
    show: false, // Hidden initially
    frame: false, // Frameless window
    transparent: true, // Transparent for floating effect
    alwaysOnTop: true, // Float above music player
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load Vite dev server or production build
  const startUrl = process.env.VITE_DEV_SERVER_URL || `file://${path.join(__dirname, '../dist/index.html')}`;
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// OS Process Detection
function checkProcesses() {
  // Using 'tasklist' for Windows
  exec('tasklist', (err, stdout, stderr) => {
    if (err) return;
    const runningProcesses = stdout.toLowerCase();
    
    for (const player of KNOWN_PLAYERS) {
      if (runningProcesses.includes(player.exe.toLowerCase())) {
        if (mainWindow) {
          mainWindow.webContents.send('player-detected', player);
          if (!mainWindow.isVisible()) {
            mainWindow.show();
            // Optional: Bring to front and focus
            mainWindow.setAlwaysOnTop(true, 'floating');
          }
        }
        return; // Only notify the first found
      }
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  // Poll every 3 seconds for running music players
  detectionInterval = setInterval(checkProcesses, 3000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  if (detectionInterval) clearInterval(detectionInterval);
});

// IPC handlers
ipcMain.on('hide-window', () => {
  if (mainWindow) mainWindow.hide();
});

ipcMain.on('show-window', () => {
  if (mainWindow) mainWindow.show();
});
