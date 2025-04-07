const { contextBridge, ipcRenderer } = require('electron');

// Expondo APIs seguras para a janela de renderização
contextBridge.exposeInMainWorld(
  'api', {
    // Autenticação
    auth: {
      login: (password) => ipcRenderer.invoke('auth:login', password),
      changePassword: (newPassword) => ipcRenderer.invoke('auth:change-password', newPassword)
    },
    
    // Cliente
    cliente: {
      getAll: () => ipcRenderer.invoke('cliente:getAll'),
      getById: (id) => ipcRenderer.invoke('cliente:getById', id),
      create: (cliente) => ipcRenderer.invoke('cliente:create', cliente),
      update: (id, cliente) => ipcRenderer.invoke('cliente:update', id, cliente),
      delete: (id) => ipcRenderer.invoke('cliente:delete', id),
      search: (term) => ipcRenderer.invoke('cliente:search', term)
    },
    
    // Nota
    nota: {
      getAll: () => ipcRenderer.invoke('nota:getAll'),
      getById: (id) => ipcRenderer.invoke('nota:getById', id),
      getByCliente: (clienteId) => ipcRenderer.invoke('nota:getByCliente', clienteId),
      create: (nota) => ipcRenderer.invoke('nota:create', nota),
      update: (id, nota) => ipcRenderer.invoke('nota:update', id, nota),
      delete: (id) => ipcRenderer.invoke('nota:delete', id),
      updateStatus: (id, status) => ipcRenderer.invoke('nota:updateStatus', id, status)
    },
    
    // Configurações
    config: {
      getTheme: () => ipcRenderer.invoke('config:getTheme'),
      setTheme: (theme) => ipcRenderer.invoke('config:setTheme', theme)
    },
    
    // Backup
    backup: {
      create: () => ipcRenderer.invoke('backup:create'),
      restore: (filePath) => ipcRenderer.invoke('backup:restore', filePath)
    }
  }
);