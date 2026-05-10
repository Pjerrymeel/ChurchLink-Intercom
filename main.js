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
  const tsxPath = path.join(__dirname, 'node_modules', 'tsx', 'dist', 'cli.mjs');
  
  console.log(`Starting server from: ${serverPath}`);
  
  let command;
  let finalArgs;

  if (app.isPackaged) {
    // In packaged app, we use the bundled node version to run tsx
    const tsxPath = path.join(__dirname, 'node_modules', 'tsx', 'dist', 'cli.mjs');
    command = process.execPath;
    finalArgs = [tsxPath, serverPath];
  } else {
    // In development, use npx
    command = 'npx';
    finalArgs = ['tsx', serverPath];
  }
  
  console.log(`Executing: ${command} ${finalArgs.join(' ')}`);

  serverProcess = spawn(command, finalArgs, {
    cwd: __dirname,
    shell: true,
    env: { 
      ...process.env, 
      NODE_ENV: 'production',
      PORT: '3000'
    }
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`Server: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Server Error: ${data}`);
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
