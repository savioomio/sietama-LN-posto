import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário já está autenticado
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(storedAuth);
    setLoading(false);
  }, []);

  const login = async (password) => {
    try {
      // Verifica a senha com o processo principal do Electron
      const isValid = await window.api.auth.login(password);
      
      if (isValid) {
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        navigate('/');
        toast.success('Login realizado com sucesso!');
        return true;
      } else {
        toast.error('Senha incorreta!');
        return false;
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('Erro ao fazer login!');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    navigate('/login');
    toast.info('Sessão encerrada!');
  };

  const changePassword = async (newPassword) => {
    try {
      await window.api.auth.changePassword(newPassword);
      toast.success('Senha alterada com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast.error('Erro ao alterar senha!');
      return false;
    }
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};