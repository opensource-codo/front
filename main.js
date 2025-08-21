// main.js (루트)
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process'); // ★ 반드시 추가

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 1100,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });
  win.setPosition(20,40);
  win.show();


  if (isDev) {
    win.loadURL('http://localhost:3000'); // CRA dev 서버
  } else {
    win.loadFile(path.join(__dirname, 'build', 'index.html')); // 빌드 파일
  }
}


ipcMain.handle('native:run-python', async (_evt, { scriptPath, args = [], timeoutMs = 15000 }) => {
  const baseDir = app.isPackaged ? process.resourcesPath : app.getAppPath();
  const absScript = path.resolve(baseDir, scriptPath);
  const pythonExe = process.env.CONDA_PYTHON_EXE || 'python';

  return new Promise((resolve) => {
    const child = spawn(pythonExe, [absScript, ...args], { windowsHide: true });

    let stdout = '', stderr = '';
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      resolve({ ok: false, code: -1, stdout, stderr: `timeout ${timeoutMs}ms` });
    }, timeoutMs);

    child.stdout.on('data', d => stdout += d.toString());
    child.stderr.on('data', d => stderr += d.toString());
    child.on('close', code => {
      clearTimeout(timer);
      resolve({ ok: code === 0, code, stdout, stderr });
    });
  });
}); 

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

