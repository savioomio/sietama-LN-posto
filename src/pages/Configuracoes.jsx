import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiLock, FiDownload, FiUpload } from 'react-icons/fi';

import Header from '../components/common/Header';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../contexts/AuthContext';
import { useConfig } from '../contexts/ConfigContext';

const Configuracoes = () => {
  const navigate = useNavigate();
  const { changePassword } = useAuth();
  const { theme, changeTheme, createBackup, restoreBackup } = useConfig();
  
  const [loading, setLoading] = useState(false);
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [temaAtual, setTemaAtual] = useState(theme);
  const [backupStatus, setBackupStatus] = useState('');
  
  // Altera o tema
  const handleThemeChange = async (novoTema) => {
    setTemaAtual(novoTema);
    await changeTheme(novoTema);
  };
  
  // Altera a senha
  const handleChangeSenha = async (e) => {
    e.preventDefault();
    
    // Validação
    if (senha !== confirmaSenha) {
      setSenhaError('As senhas não conferem');
      return;
    }
    
    if (senha.length < 6) {
      setSenhaError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    
    try {
      await changePassword(senha);
      setSenha('');
      setConfirmaSenha('');
      setSenhaError('');
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      setSenhaError('Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };
  
  // Cria um backup
  const handleCreateBackup = async () => {
    setLoading(true);
    setBackupStatus('Gerando backup...');
    
    try {
      const backupPath = await createBackup();
      setBackupStatus(`Backup criado com sucesso: ${backupPath}`);
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      setBackupStatus('Erro ao criar backup');
    } finally {
      setLoading(false);
    }
  };
  
  // Abre o diálogo para selecionar um arquivo de backup
  const handleSelectBackupFile = () => {
    // Cria um input file oculto
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.sqlite';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setLoading(true);
        setBackupStatus('Restaurando backup...');
        
        try {
          await restoreBackup(file.path);
          setBackupStatus('Backup restaurado com sucesso');
          // Reload será feito automaticamente pelo contexto
        } catch (error) {
          console.error('Erro ao restaurar backup:', error);
          setBackupStatus('Erro ao restaurar backup');
          setLoading(false);
        }
      }
    };
    
    input.click();
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto py-6 px-4">
        <div className="mb-6 flex items-center">
          <Button
            variant="outline"
            className="mr-4"
            onClick={() => navigate('/')}
          >
            <FiArrowLeft className="mr-2" /> Voltar
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-800">
            Configurações
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Segurança */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FiLock className="mr-2 text-primary-600" size={20} />
              <h2 className="text-xl font-bold text-gray-800">Segurança</h2>
            </div>
            
            <form onSubmit={handleChangeSenha}>
              <Input
                id="senha"
                type="password"
                label="Nova Senha"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  setSenhaError('');
                }}
                required
                className="mb-4"
              />
              
              <Input
                id="confirmaSenha"
                type="password"
                label="Confirmar Senha"
                value={confirmaSenha}
                onChange={(e) => {
                  setConfirmaSenha(e.target.value);
                  setSenhaError('');
                }}
                error={senhaError}
                required
                className="mb-6"
              />
              
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center"
              >
                <FiSave className="mr-2" /> Alterar Senha
              </Button>
            </form>
          </div>
          
          {/* Backup */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Backup e Restauração</h2>
            
            <p className="text-sm text-gray-600 mb-4">
              Faça backup dos seus dados regularmente para evitar perda de informações. A restauração substitui todos os dados atuais!
            </p>
            
            <div className="flex flex-col space-y-3">
              <Button
                onClick={handleCreateBackup}
                disabled={loading}
                className="flex items-center"
                variant="primary"
              >
                <FiDownload className="mr-2" /> Criar Backup
              </Button>
              
              <Button
                onClick={handleSelectBackupFile}
                disabled={loading}
                className="flex items-center"
                variant="outline"
              >
                <FiUpload className="mr-2" /> Restaurar Backup
              </Button>
            </div>
            
            {backupStatus && (
              <p className={`mt-3 text-sm ${backupStatus.includes('Erro') ? 'text-red-600' : 'text-green-600'}`}>
                {backupStatus}
              </p>
            )}
          </div>
          
          {/* Sobre */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Sobre o Sistema</h2>
            
            <div className="space-y-2">
              <p className="text-lg font-semibold text-center mb-4">Posto Licínio</p>
              
              <p className="text-sm text-gray-600">
                <span className="font-medium">Versão:</span> 1.0.0
              </p>
              
              <p className="text-sm text-gray-600">
                <span className="font-medium">Desenvolvido por:</span> Sávio Pessoa Afonso
              </p>
              
              <p className="text-sm text-gray-600">
                <span className="font-medium">Contato:</span> saviopessoaafonso@gmail.com
              </p>
              
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-center text-gray-500">
                  © {new Date().getFullYear()} Posto Licínio. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Configuracoes;