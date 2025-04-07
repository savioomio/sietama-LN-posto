const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';
const Store = require('electron-store');
const store = new Store();
const db = require(path.join(__dirname, 'database.js'));

// Inicializa o banco de dados
db.initDatabase();

let mainWindow;

function createWindow() {
  // Cria a janela do navegador.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'favicon.ico')
  });

  // Carrega o arquivo index.html do aplicativo.
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // Abre o DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Emitido quando a janela é fechada.
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Este método será chamado quando o Electron terminar de inicializar
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // No macOS, é comum recriar uma janela no app quando o
    // ícone da dock é clicado e não há outras janelas abertas.
    if (mainWindow === null) createWindow();
  });
});

// Sair quando todas as janelas estiverem fechadas, exceto no macOS.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Eventos IPC (comunicação entre processos)

// Autenticação
ipcMain.handle('auth:login', async (event, password) => {
  const storedPassword = store.get('adminPassword') || 'admin123'; // Senha padrão
  return password === storedPassword;
});

ipcMain.handle('auth:change-password', async (event, newPassword) => {
  store.set('adminPassword', newPassword);
  return true;
});

// Cliente
ipcMain.handle('cliente:getAll', async () => {
  return db.getAllClientes();
});

ipcMain.handle('cliente:getById', async (event, id) => {
  return db.getClienteById(id);
});

ipcMain.handle('cliente:create', async (event, cliente) => {
  return db.createCliente(cliente);
});

ipcMain.handle('cliente:update', async (event, id, cliente) => {
  return db.updateCliente(id, cliente);
});

ipcMain.handle('cliente:delete', async (event, id) => {
  return db.deleteCliente(id);
});

ipcMain.handle('cliente:search', async (event, term) => {
  return db.searchClientes(term);
});

// Nota
ipcMain.handle('nota:getAll', async () => {
  return db.getAllNotas();
});

ipcMain.handle('nota:getById', async (event, id) => {
  return db.getNotaById(id);
});

ipcMain.handle('nota:getByCliente', async (event, clienteId) => {
  return db.getNotasByCliente(clienteId);
});

ipcMain.handle('nota:create', async (event, nota) => {
  return db.createNota(nota);
});

ipcMain.handle('nota:update', async (event, id, nota) => {
  return db.updateNota(id, nota);
});

ipcMain.handle('nota:delete', async (event, id) => {
  return db.deleteNota(id);
});

ipcMain.handle('nota:updateStatus', async (event, id, status) => {
  return db.updateNotaStatus(id, status);
});

// Configurações
ipcMain.handle('config:getTheme', () => {
  return store.get('theme') || 'light';
});

ipcMain.handle('config:setTheme', (event, theme) => {
  store.set('theme', theme);
  return theme;
});

// Backup
ipcMain.handle('backup:create', async () => {
  return db.createBackup();
});

ipcMain.handle('backup:restore', async (event, filePath) => {
  return db.restoreBackup(filePath);
});