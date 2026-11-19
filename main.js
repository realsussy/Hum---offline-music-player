const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

const AUDIO = /\.(mp3|m4a|wav|ogg|flac|aac|opus)$/i;

function scan(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) scan(p, out);
    else if (AUDIO.test(e.name)) out.push({ path: p, name: e.name });
  }
  return out;
}

ipcMain.handle('pick', async () => {
  const r = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  return r.canceled ? null : r.filePaths[0];
});
ipcMain.handle('scan', (_, dir) => { try { return scan(dir); } catch (e) { return []; } });

ipcMain.handle('fetchJson', async (_, url) => {
  if (!/^https:\/\/lrclib\.net\//.test(url)) return { ok: false, err: true };
  try { const r = await fetch(url); return { ok: r.ok, json: r.ok ? await r.json() : null }; }
  catch (e) { return { ok: false, err: true }; }
});

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1100, height: 720, backgroundColor: '#171a33', autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  });
  win.loadFile('index.html');
});
app.on('window-all-closed', () => app.quit());
