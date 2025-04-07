import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const NotaContext = createContext();

export function useNota() {
  return useContext(NotaContext);
}

export const NotaProvider = ({ children }) => {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notaAtual, setNotaAtual] = useState(null);

  // Carrega todas as notas ao iniciar
  useEffect(() => {
    loadNotas();
  }, []);

  // Função para carregar todas as notas
  const loadNotas = async () => {
    try {
      setLoading(true);
      const data = await window.api.nota.getAll();
      setNotas(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
      toast.error('Erro ao carregar a lista de notas');
      setLoading(false);
    }
  };

  // Função para buscar uma nota por ID
  const getNotaById = async (id) => {
    try {
      const nota = await window.api.nota.getById(id);
      
      // Converte produtos de JSON para Array se necessário
      if (nota && typeof nota.produtos === 'string') {
        nota.produtos = JSON.parse(nota.produtos);
      }
      
      setNotaAtual(nota);
      return nota;
    } catch (error) {
      console.error('Erro ao buscar nota:', error);
      toast.error('Erro ao buscar informações da nota');
      return null;
    }
  };

  // Função para buscar notas por cliente
  const getNotasByCliente = async (clienteId) => {
    try {
      const clienteNotas = await window.api.nota.getByCliente(clienteId);
      
      // Converte produtos de JSON para Array se necessário
      const notasProcessadas = clienteNotas.map(nota => {
        if (typeof nota.produtos === 'string') {
          return { ...nota, produtos: JSON.parse(nota.produtos) };
        }
        return nota;
      });
      
      return notasProcessadas;
    } catch (error) {
      console.error('Erro ao buscar notas do cliente:', error);
      toast.error('Erro ao buscar notas do cliente');
      return [];
    }
  };

  // Função para criar uma nova nota
  const createNota = async (notaData) => {
    try {
      const newNota = await window.api.nota.create(notaData);
      
      // Converte produtos de JSON para Array se necessário
      if (typeof newNota.produtos === 'string') {
        newNota.produtos = JSON.parse(newNota.produtos);
      }
      
      setNotas([...notas, newNota]);
      toast.success('Nota cadastrada com sucesso!');
      return newNota;
    } catch (error) {
      console.error('Erro ao criar nota:', error);
      toast.error('Erro ao cadastrar nota');
      return null;
    }
  };

  // Função para atualizar uma nota
  const updateNota = async (id, notaData) => {
    try {
      const updatedNota = await window.api.nota.update(id, notaData);
      
      // Converte produtos de JSON para Array se necessário
      let processedNota = updatedNota;
      if (typeof updatedNota.produtos === 'string') {
        processedNota = { ...updatedNota, produtos: JSON.parse(updatedNota.produtos) };
      }
      
      setNotas(notas.map(n => n.id === id ? processedNota : n));
      toast.success('Nota atualizada com sucesso!');
      return processedNota;
    } catch (error) {
      console.error('Erro ao atualizar nota:', error);
      toast.error('Erro ao atualizar nota');
      return null;
    }
  };

  // Função para excluir uma nota
  const deleteNota = async (id) => {
    try {
      await window.api.nota.delete(id);
      setNotas(notas.filter(n => n.id !== id));
      toast.success('Nota excluída com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao excluir nota:', error);
      toast.error('Erro ao excluir nota');
      return false;
    }
  };

  // Função para atualizar o status de uma nota
  const updateNotaStatus = async (id, status) => {
    try {
      await window.api.nota.updateStatus(id, status);
      setNotas(notas.map(n => n.id === id ? { ...n, status } : n));
      toast.success(`Nota marcada como ${status === 'paga' ? 'paga' : 'pendente'}!`);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar status da nota:', error);
      toast.error('Erro ao atualizar status da nota');
      return false;
    }
  };

  const value = {
    notas,
    loading,
    notaAtual,
    loadNotas,
    getNotaById,
    getNotasByCliente,
    createNota,
    updateNota,
    deleteNota,
    updateNotaStatus,
    setNotaAtual
  };

  return (
    <NotaContext.Provider value={value}>
      {children}
    </NotaContext.Provider>
  );
};