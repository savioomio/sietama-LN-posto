/**
 * Serviço para comunicação com o backend (Electron/SQLite)
 * Este arquivo encapsula todas as chamadas para o backend através do preload.js
 */

// Cliente
export const getAllClientes = async () => {
    try {
      return await window.api.cliente.getAll();
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  };
  
  export const getClienteById = async (id) => {
    try {
      return await window.api.cliente.getById(id);
    } catch (error) {
      console.error('Erro ao buscar cliente por ID:', error);
      throw error;
    }
  };
  
  export const createCliente = async (cliente) => {
    try {
      return await window.api.cliente.create(cliente);
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  };
  
  export const updateCliente = async (id, cliente) => {
    try {
      return await window.api.cliente.update(id, cliente);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  };
  
  export const deleteCliente = async (id) => {
    try {
      return await window.api.cliente.delete(id);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      throw error;
    }
  };
  
  export const searchClientes = async (termo) => {
    try {
      return await window.api.cliente.search(termo);
    } catch (error) {
      console.error('Erro ao pesquisar clientes:', error);
      throw error;
    }
  };
  
  // Nota
  export const getAllNotas = async () => {
    try {
      return await window.api.nota.getAll();
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
      throw error;
    }
  };
  
  export const getNotaById = async (id) => {
    try {
      return await window.api.nota.getById(id);
    } catch (error) {
      console.error('Erro ao buscar nota por ID:', error);
      throw error;
    }
  };
  
  export const getNotasByCliente = async (clienteId) => {
    try {
      return await window.api.nota.getByCliente(clienteId);
    } catch (error) {
      console.error('Erro ao buscar notas por cliente:', error);
      throw error;
    }
  };
  
  export const createNota = async (nota) => {
    try {
      return await window.api.nota.create(nota);
    } catch (error) {
      console.error('Erro ao criar nota:', error);
      throw error;
    }
  };
  
  export const updateNota = async (id, nota) => {
    try {
      return await window.api.nota.update(id, nota);
    } catch (error) {
      console.error('Erro ao atualizar nota:', error);
      throw error;
    }
  };
  
  export const deleteNota = async (id) => {
    try {
      return await window.api.nota.delete(id);
    } catch (error) {
      console.error('Erro ao excluir nota:', error);
      throw error;
    }
  };
  
  export const updateNotaStatus = async (id, status) => {
    try {
      return await window.api.nota.updateStatus(id, status);
    } catch (error) {
      console.error('Erro ao atualizar status da nota:', error);
      throw error;
    }
  };
  
  // Autenticação
  export const login = async (senha) => {
    try {
      return await window.api.auth.login(senha);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };
  
  export const changePassword = async (novaSenha) => {
    try {
      return await window.api.auth.changePassword(novaSenha);
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw error;
    }
  };
  
  // Configurações
  export const getTheme = async () => {
    try {
      return await window.api.config.getTheme();
    } catch (error) {
      console.error('Erro ao obter tema:', error);
      throw error;
    }
  };
  
  export const setTheme = async (tema) => {
    try {
      return await window.api.config.setTheme(tema);
    } catch (error) {
      console.error('Erro ao definir tema:', error);
      throw error;
    }
  };
  
  // Backup
  export const createBackup = async () => {
    try {
      return await window.api.backup.create();
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      throw error;
    }
  };
  
  export const restoreBackup = async (filePath) => {
    try {
      return await window.api.backup.restore(filePath);
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      throw error;
    }
  };