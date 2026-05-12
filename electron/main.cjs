const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;
let detectionInterval;
let currentlyActivePlayer = null;

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
    skipTaskbar: true, // Don't show in taskbar so it feels like a widget
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = process.env.VITE_DEV_SERVER_URL || `file://${path.join(__dirname, '../dist/index.html')}`;
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// OS Process Detection
function checkProcesses() {
  // Use tasklist but filter for running processes to make it slightly faster
  exec('tasklist /FI "STATUS eq RUNNING" /FO CSV /NH', (err, stdout, stderr) => {
    if (err) return;
    
    const runningProcesses = stdout.toLowerCase();
    let foundPlayer = null;
    
    for (const player of KNOWN_PLAYERS) {
      if (runningProcesses.includes(player.exe.toLowerCase())) {
        foundPlayer = player;
        break; // Stop at first found
      }
    }

    if (foundPlayer) {
      // If we found a player and it's new (or we just launched)
      if (!currentlyActivePlayer || currentlyActivePlayer.name !== foundPlayer.name) {
        currentlyActivePlayer = foundPlayer;
        
        if (mainWindow) {
          mainWindow.webContents.send('player-detected', foundPlayer);
          // POP UP behavior
          if (!mainWindow.isVisible()) {
            mainWindow.show();
            mainWindow.focus(); // Bring to foreground immediately
          }
        }
      }
    } else {
      // If NO music player is running, hide the assistant
      if (currentlyActivePlayer) {
        currentlyActivePlayer = null;
        if (mainWindow && mainWindow.isVisible()) {
          mainWindow.hide(); // Disappear cleanly
        }
      }
    }
  });
}

// Ensure single instance lock so we don't open 5 assistants
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();

    // Poll every 1.5 seconds for extremely snappy pop-ups
    detectionInterval = setInterval(checkProcesses, 1500);

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
}

// IPC handlers
ipcMain.on('hide-window', () => {
  if (mainWindow) mainWindow.hide();
});

ipcMain.on('show-window', () => {
  if (mainWindow) mainWindow.show();
});
