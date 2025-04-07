import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const ConfigContext = createContext();

export function useConfig() {
  return useContext(ConfigContext);
}

export const ConfigProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  // Carrega as configurações ao iniciar
  useEffect(() => {
    loadConfig();
  }, []);

  // Função para carregar configurações
  const loadConfig = async () => {
    try {
      setLoading(true);
      const savedTheme = await window.api.config.getTheme();
      setTheme(savedTheme);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      setLoading(false);
    }
  };

  // Função para alterar o tema
  const changeTheme = async (newTheme) => {
    try {
      await window.api.config.setTheme(newTheme);
      setTheme(newTheme);
      toast.success('Tema alterado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao alterar tema:', error);
      toast.error('Erro ao alterar tema');
      return false;
    }
  };

  // Função para criar um backup
  const createBackup = async () => {
    try {
      const backupPath = await window.api.backup.create();
      toast.success('Backup criado com sucesso!');
      return backupPath;
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      toast.error('Erro ao criar backup');
      return null;
    }
  };

  // Função para restaurar um backup
  const restoreBackup = async (filePath) => {
    try {
      const success = await window.api.backup.restore(filePath);
      if (success) {
        toast.success('Backup restaurado com sucesso!');
        // Recarrega a aplicação para refletir os dados restaurados
        window.location.reload();
        return true;
      } else {
        toast.error('Erro ao restaurar backup');
        return false;
      }
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      toast.error('Erro ao restaurar backup');
      return false;
    }
  };

  const value = {
    theme,
    loading,
    changeTheme,
    createBackup,
    restoreBackup
  };

  return (
    <ConfigContext.Provider value={value}>
      {!loading && children}
    </ConfigContext.Provider>
  );
};