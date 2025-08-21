// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('native', {
  ping: () => 'pong',
  runPython: (opts) => ipcRenderer.invoke('native:run-python', opts),
});
