const path = require('path');
const { app } = require('electron');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Usamos uma abordagem simplificada: armazenar dados em JSON via electron-store
const Store = require('electron-store');

// Configuramos stores separados para clientes e notas
const clienteStore = new Store({ name: 'clientes' });
const notaStore = new Store({ name: 'notas' });

// Função para inicializar o banco de dados (verificar se existem as stores)
function initDatabase() {
  // Verifica se já existem clientes e notas
  if (!clienteStore.has('clientes')) {
    clienteStore.set('clientes', []);
  }
  
  if (!notaStore.has('notas')) {
    notaStore.set('notas', []);
  }
  
  return true;
}

// Funções para manipulação de Clientes
async function getAllClientes() {
  return clienteStore.get('clientes') || [];
}

async function getClienteById(id) {
  const clientes = clienteStore.get('clientes') || [];
  return clientes.find(cliente => cliente.id === id) || null;
}

async function createCliente(cliente) {
  const clientes = clienteStore.get('clientes') || [];
  
  const newCliente = {
    ...cliente,
    id: uuidv4(),
    dataCadastro: new Date().toISOString()
  };
  
  clientes.push(newCliente);
  clienteStore.set('clientes', clientes);
  
  return newCliente;
}

async function updateCliente(id, cliente) {
  const clientes = clienteStore.get('clientes') || [];
  const index = clientes.findIndex(c => c.id === id);
  
  if (index === -1) {
    throw new Error('Cliente não encontrado');
  }
  
  const updatedCliente = { ...clientes[index], ...cliente, id };
  clientes[index] = updatedCliente;
  
  clienteStore.set('clientes', clientes);
  return updatedCliente;
}

async function deleteCliente(id) {
  const clientes = clienteStore.get('clientes') || [];
  const filteredClientes = clientes.filter(c => c.id !== id);
  
  // Também exclui todas as notas relacionadas a este cliente
  const notas = notaStore.get('notas') || [];
  const filteredNotas = notas.filter(n => n.clienteId !== id);
  
  clienteStore.set('clientes', filteredClientes);
  notaStore.set('notas', filteredNotas);
  
  return true;
}

async function searchClientes(term) {
  if (!term) {
    return getAllClientes();
  }
  
  const clientes = clienteStore.get('clientes') || [];
  const termLower = term.toLowerCase();
  
  return clientes.filter(cliente => 
    cliente.nome.toLowerCase().includes(termLower) ||
    cliente.documento.includes(term)
  );
}

// Funções para manipulação de Notas
async function getAllNotas() {
  const notas = notaStore.get('notas') || [];
  const clientes = clienteStore.get('clientes') || [];
  
  // Adiciona informações do cliente em cada nota
  return notas.map(nota => {
    const cliente = clientes.find(c => c.id === nota.clienteId) || {};
    return {
      ...nota,
      clienteNome: cliente.nome,
      clienteDocumento: cliente.documento
    };
  });
}

async function getNotaById(id) {
  const notas = notaStore.get('notas') || [];
  const nota = notas.find(nota => nota.id === id);
  
  if (!nota) {
    return null;
  }
  
  const clientes = clienteStore.get('clientes') || [];
  const cliente = clientes.find(c => c.id === nota.clienteId) || {};
  
  return {
    ...nota,
    clienteNome: cliente.nome,
    clienteDocumento: cliente.documento
  };
}

async function getNotasByCliente(clienteId) {
  const notas = notaStore.get('notas') || [];
  return notas.filter(nota => nota.clienteId === clienteId);
}

async function createNota(nota) {
  const notas = notaStore.get('notas') || [];
  
  // Garantir que produtos seja um objeto JSON
  let produtos = nota.produtos;
  if (typeof produtos !== 'string') {
    produtos = JSON.stringify(produtos);
  }
  
  const newNota = {
    ...nota,
    id: uuidv4(),
    produtos
  };
  
  notas.push(newNota);
  notaStore.set('notas', notas);
  
  return newNota;
}

async function updateNota(id, nota) {
  const notas = notaStore.get('notas') || [];
  const index = notas.findIndex(n => n.id === id);
  
  if (index === -1) {
    throw new Error('Nota não encontrada');
  }
  
  // Garantir que produtos seja um objeto JSON
  let produtos = nota.produtos;
  if (typeof produtos !== 'string') {
    produtos = JSON.stringify(produtos);
  }
  
  const updatedNota = { ...notas[index], ...nota, id, produtos };
  notas[index] = updatedNota;
  
  notaStore.set('notas', notas);
  return updatedNota;
}

async function deleteNota(id) {
  const notas = notaStore.get('notas') || [];
  const filteredNotas = notas.filter(n => n.id !== id);
  
  notaStore.set('notas', filteredNotas);
  return true;
}

async function updateNotaStatus(id, status) {
  const notas = notaStore.get('notas') || [];
  const index = notas.findIndex(n => n.id === id);
  
  if (index === -1) {
    throw new Error('Nota não encontrada');
  }
  
  notas[index] = { ...notas[index], status };
  notaStore.set('notas', notas);
  
  return true;
}

// Funções de backup
async function createBackup() {
  const backupDir = path.join(app.getPath('userData'), 'backups');
  
  // Cria a pasta de backups se não existir
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }
  
  const date = new Date().toISOString().replace(/:/g, '-');
  const backupPath = path.join(backupDir, `backup-${date}.json`);
  
  const backupData = {
    clientes: clienteStore.get('clientes') || [],
    notas: notaStore.get('notas') || []
  };
  
  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
  
  return backupPath;
}

async function restoreBackup(backupPath) {
  try {
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    
    if (backupData.clientes) {
      clienteStore.set('clientes', backupData.clientes);
    }
    
    if (backupData.notas) {
      notaStore.set('notas', backupData.notas);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao restaurar backup:', error);
    return false;
  }
}

module.exports = {
  initDatabase,
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  searchClientes,
  getAllNotas,
  getNotaById,
  getNotasByCliente,
  createNota,
  updateNota,
  deleteNota,
  updateNotaStatus,
  createBackup,
  restoreBackup
};