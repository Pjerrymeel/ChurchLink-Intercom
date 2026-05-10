import { app, BrowserWindow, Tray, Menu } from 'electron';
import path from 'path';
import { spawn } from 'child_process';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let tray;
let serverProcess;

function startServer() {
  const serverPath = path.join(__dirname, 'server.ts');
  
  console.log(`[MAIN] Initializing Intercom Hub Server...`);
  console.log(`[MAIN] Server Source: ${serverPath}`);
  
  let command;
  let finalArgs;

  // In this environment, tsx is available via node_modules
  const tsxCli = path.join(__dirname, 'node_modules', 'tsx', 'dist', 'cli.mjs');

  if (app.isPackaged) {
    command = process.execPath;
    finalArgs = [tsxCli, serverPath];
  } else {
    command = 'node';
    finalArgs = [tsxCli, serverPath];
  }
  
  console.log(`[MAIN] Spawning Intercom Engine: ${command} ${finalArgs.join(' ')}`);

  serverProcess = spawn(command, finalArgs, {
    cwd: __dirname,
    shell: true,
    env: { 
      ...process.env, 
      NODE_ENV: app.isPackaged ? 'production' : 'development',
      PORT: '3000'
    }
  });

  serverProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`[SERVER]: ${output}`);
    
    // Broadcast status to window if it exists
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('server-log', output);
    }
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`[SERVER ERROR]: ${data}`);
  });

  serverProcess.on('close', (code) => {
    console.log(`[MAIN] Server process exited with code ${code}`);
    // Optional: Restart server if it crashed
    if (code !== 0 && !app.isQuiting) {
        console.log('[MAIN] Attempting to restart Intercom Engine...');
        setTimeout(startServer, 2000);
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "ChurchLink Intercom",
    icon: path.join(__dirname, 'public', 'favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  // Load the app
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    // In development, we wait a bit for Vite to start inside the server process
    // But since we want to be robust, we'll try to load it and the server handles the retry/wait
    mainWindow.loadURL('http://localhost:3000');
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  const iconPath = path.join(__dirname, 'public', 'favicon.ico');
  tray = new Tray(iconPath);
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open ChurchLink', click: () => {
      if (mainWindow) {
        mainWindow.show();
      } else {
        createWindow();
      }
    }},
    { label: 'Quit', click: () => {
      app.isQuiting = true;
      app.quit();
    }}
  ]);

  tray.setToolTip('ChurchLink Intercom Server');
  tray.setContextMenu(contextMenu);
}

app.on('ready', () => {
  startServer();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (serverProcess) serverProcess.kill();
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
