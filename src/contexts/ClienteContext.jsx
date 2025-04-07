import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const ClienteContext = createContext();

export function useCliente() {
  return useContext(ClienteContext);
}

export const ClienteProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clienteAtual, setClienteAtual] = useState(null);

  // Carrega todos os clientes ao iniciar
  useEffect(() => {
    loadClientes();
  }, []);

  // Função para carregar todos os clientes
  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await window.api.cliente.getAll();
      setClientes(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast.error('Erro ao carregar a lista de clientes');
      setLoading(false);
    }
  };

  // Função para buscar um cliente por ID
  const getClienteById = async (id) => {
    try {
      const cliente = await window.api.cliente.getById(id);
      setClienteAtual(cliente);
      return cliente;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      toast.error('Erro ao buscar informações do cliente');
      return null;
    }
  };

  // Função para criar um novo cliente
  const createCliente = async (clienteData) => {
    try {
      const newCliente = await window.api.cliente.create(clienteData);
      setClientes([...clientes, newCliente]);
      toast.success('Cliente cadastrado com sucesso!');
      return newCliente;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast.error('Erro ao cadastrar cliente');
      return null;
    }
  };

  // Função para atualizar um cliente
  const updateCliente = async (id, clienteData) => {
    try {
      const updatedCliente = await window.api.cliente.update(id, clienteData);
      setClientes(clientes.map(c => c.id === id ? updatedCliente : c));
      toast.success('Cliente atualizado com sucesso!');
      return updatedCliente;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast.error('Erro ao atualizar cliente');
      return null;
    }
  };

  // Função para excluir um cliente
  const deleteCliente = async (id) => {
    try {
      await window.api.cliente.delete(id);
      setClientes(clientes.filter(c => c.id !== id));
      toast.success('Cliente excluído com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast.error('Erro ao excluir cliente');
      return false;
    }
  };

  // Função para pesquisar clientes
  const searchClientes = async (term) => {
    try {
      if (!term.trim()) {
        return loadClientes();
      }
      
      const results = await window.api.cliente.search(term);
      setClientes(results);
      return results;
    } catch (error) {
      console.error('Erro ao pesquisar clientes:', error);
      toast.error('Erro ao pesquisar clientes');
      return [];
    }
  };

  const value = {
    clientes,
    loading,
    clienteAtual,
    loadClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
    searchClientes,
    setClienteAtual
  };

  return (
    <ClienteContext.Provider value={value}>
      {children}
    </ClienteContext.Provider>
  );
};