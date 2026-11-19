const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('native', {
  pickFolder: () => ipcRenderer.invoke('pick'),
  scan: (dir) => ipcRenderer.invoke('scan', dir),
  fetchJson: (url) => ipcRenderer.invoke('fetchJson', url)
});
