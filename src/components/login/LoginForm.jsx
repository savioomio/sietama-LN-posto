import React, { useState } from 'react';
import { FiLogIn, FiLock } from 'react-icons/fi';
import Button from '../common/Button';
import Input from '../common/Input';

const LoginForm = ({ onSubmit, loading }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Por favor, digite a senha');
      return;
    }
    
    try {
      const success = await onSubmit(password);
      if (!success) {
        setError('Senha incorreta');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro ao fazer login. Tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold text-primary-700 mb-2">Posto Licínio</h1>
        <p className="text-gray-600">Sistema de Gerenciamento</p>
      </div>
      
      <Input
        id="password"
        type="password"
        label="Senha de Administrador"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError('');
        }}
        error={error}
        required
        icon={<FiLock className="text-gray-400" />}
      />
      
      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={loading}
        className="flex items-center justify-center"
      >
        <FiLogIn className="mr-2" />
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
};

export default LoginForm;