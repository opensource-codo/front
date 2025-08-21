// main.js (루트)
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

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


ipcMain.handle('run-python', async (_event, { scriptPath, args = [], pythonBin = 'python', timeoutMs = 15000 }) => {
  return new Promise((resolve) => {
    try {
      // Scripts 폴더 기준 절대 경로로 고정
      const absScript = path.isAbsolute(scriptPath)
        ? scriptPath
        : path.join(process.cwd(), 'Scripts', scriptPath); // 예: 'enable_wifi.py'

      const ps = spawn(pythonBin, [absScript, ...args], { shell: false });

      let stdout = '';
      let stderr = '';

      const killTimer = setTimeout(() => {
        try { ps.kill('SIGKILL'); } catch {}
        resolve({ ok: false, code: -1, stdout, stderr: `${stderr}\n[timeout] ${timeoutMs}ms` });
      }, timeoutMs);

      ps.stdout.on('data', (d) => (stdout += d.toString()));
      ps.stderr.on('data', (d) => (stderr += d.toString()));

      ps.on('error', (err) => {
        clearTimeout(killTimer);
        resolve({ ok: false, code: -1, stdout, stderr: String(err) });
      });

      ps.on('close', (code) => {
        clearTimeout(killTimer);
        resolve({ ok: code === 0, code, stdout, stderr });
      });
    } catch (e) {
      resolve({ ok: false, code: -1, stdout: '', stderr: String(e) });
    }
  });
});


app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

