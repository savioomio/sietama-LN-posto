import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiArrowLeft, FiEdit, FiFileText, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';

import Header from '../components/common/Header';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { useCliente } from '../contexts/ClienteContext';
import { useNota } from '../contexts/NotaContext';

const PerfilCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getClienteById, deleteCliente } = useCliente();
  const { getNotasByCliente, updateNotaStatus, deleteNota } = useNota();
  
  const [cliente, setCliente] = useState(null);
  const [notas, setNotas] = useState([]);
  const [filtroNotas, setFiltroNotas] = useState('todas');
  const [loading, setLoading] = useState(true);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteNotaModal, setShowDeleteNotaModal] = useState(false);
  const [notaParaExcluir, setNotaParaExcluir] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Carrega dados do cliente
        const clienteData = await getClienteById(id);
        setCliente(clienteData);
        
        // Carrega notas do cliente
        const notasData = await getNotasByCliente(id);
        setNotas(notasData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]); 

  // Filtra notas com base no filtro selecionado
  const notasFiltradas = notas.filter(nota => {
    if (filtroNotas === 'pagas') return nota.status === 'paga';
    if (filtroNotas === 'pendentes') return nota.status === 'pendente';
    return true; // todas
  });

  // Altera o status de uma nota
  const handleChangeStatus = async (notaId, novoStatus) => {
    try {
      await updateNotaStatus(notaId, novoStatus);
      // Atualiza localmente
      setNotas(notas.map(nota => 
        nota.id === notaId ? { ...nota, status: novoStatus } : nota
      ));
    } catch (error) {
      console.error('Erro ao alterar status da nota:', error);
    }
  };

  // Abre modal para confirmação de exclusão de cliente
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  // Confirma exclusão do cliente
  const confirmDeleteCliente = async () => {
    try {
      await deleteCliente(id);
      navigate('/');
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Abre modal para confirmação de exclusão de nota
  const handleDeleteNotaClick = (nota) => {
    setNotaParaExcluir(nota);
    setShowDeleteNotaModal(true);
  };

  // Confirma exclusão da nota
  const confirmDeleteNota = async () => {
    if (!notaParaExcluir) return;
    
    try {
      await deleteNota(notaParaExcluir.id);
      // Atualiza a lista localmente
      setNotas(notas.filter(n => n.id !== notaParaExcluir.id));
    } catch (error) {
      console.error('Erro ao excluir nota:', error);
    } finally {
      setShowDeleteNotaModal(false);
      setNotaParaExcluir(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <div className="text-center py-10">
            <p>Carregando informações...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <div className="text-center py-10">
            <p className="text-lg text-red-600 mb-4">Cliente não encontrado!</p>
            <Button onClick={() => navigate('/')}>Voltar para a Lista</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto py-6 px-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="outline"
              className="mr-4"
              onClick={() => navigate('/')}
            >
              <FiArrowLeft className="mr-2" /> Voltar
            </Button>
            
            <h1 className="text-2xl font-bold text-gray-800">
              {cliente.nome}
            </h1>
          </div>
          
          <div className="flex space-x-2">
            <Link to={`/clientes/editar/${cliente.id}`}>
              <Button variant="primary" className="flex items-center">
                <FiEdit className="mr-2" /> Editar
              </Button>
            </Link>
            
            <Button 
              variant="danger" 
              className="flex items-center"
              onClick={handleDeleteClick}
            >
              <FiTrash2 className="mr-2" /> Excluir
            </Button>
          </div>
        </div>
        
        {/* Dados do Cliente */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Informações do Cliente</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Tipo</p>
              <p className="font-medium">
                {cliente.tipo === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">{cliente.tipo === 'fisica' ? 'CPF' : 'CNPJ'}</p>
              <p className="font-medium">{cliente.documento}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Endereço</p>
              <p className="font-medium">{cliente.endereco || 'Não informado'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Telefone</p>
              <p className="font-medium">{cliente.telefone || 'Não informado'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Data de Cadastro</p>
              <p className="font-medium">
                {format(new Date(cliente.dataCadastro), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </div>
          </div>
        </div>
        
        {/* Notas do Cliente */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Notas</h2>
            
            <div className="flex items-center">
              <div className="mr-4">
                <select
                  value={filtroNotas}
                  onChange={(e) => setFiltroNotas(e.target.value)}
                  className="input-primary py-1"
                >
                  <option value="todas">Todas</option>
                  <option value="pendentes">Pendentes</option>
                  <option value="pagas">Pagas</option>
                </select>
              </div>
              
              <Link to={`/notas/cadastro/${cliente.id}`}>
                <Button className="flex items-center">
                  <FiFileText className="mr-2" /> Nova Nota
                </Button>
              </Link>
            </div>
          </div>
          
          {notasFiltradas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma nota encontrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Compra
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vencimento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notasFiltradas.map((nota) => {
                    const dataCompra = new Date(nota.dataCompra);
                    const dataVencimento = new Date(nota.dataVencimento);
                    const hoje = new Date();
                    const estaVencida = dataVencimento < hoje && nota.status === 'pendente';
                    
                    return (
                      <tr key={nota.id} className={`hover:bg-gray-50 ${estaVencida ? 'bg-red-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {format(dataCompra, 'dd/MM/yyyy', { locale: ptBR })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={estaVencida ? 'text-red-600 font-medium' : ''}>
                            {format(dataVencimento, 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Intl.NumberFormat('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          }).format(nota.valor)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            nota.status === 'paga' 
                              ? 'bg-green-100 text-green-800' 
                              : estaVencida
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {nota.status === 'paga' ? 'Paga' : estaVencida ? 'Vencida' : 'Pendente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {nota.status === 'pendente' ? (
                              <button
                                onClick={() => handleChangeStatus(nota.id, 'paga')}
                                className="text-green-600 hover:text-green-900"
                                title="Marcar como paga"
                              >
                                <FiCheckCircle />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleChangeStatus(nota.id, 'pendente')}
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Marcar como pendente"
                              >
                                <FiXCircle />
                              </button>
                            )}
                            
                            <Link 
                              to={`/notas/editar/${nota.id}`}
                              className="text-primary-600 hover:text-primary-900"
                              title="Editar nota"
                            >
                              <FiEdit />
                            </Link>
                            
                            <button
                              onClick={() => handleDeleteNotaClick(nota)}
                              className="text-red-600 hover:text-red-900"
                              title="Excluir nota"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      
      {/* Modal de confirmação para excluir cliente */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Exclusão"
      >
        <div className="mb-4">
          <p>Tem certeza que deseja excluir este cliente?</p>
          <p className="text-red-600 font-medium mt-2">Esta ação não pode ser desfeita e excluirá também todas as notas relacionadas a este cliente.</p>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowDeleteModal(false)}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDeleteCliente}
          >
            Confirmar Exclusão
          </Button>
        </div>
      </Modal>
      
      {/* Modal de confirmação para excluir nota */}
      <Modal
        isOpen={showDeleteNotaModal}
        onClose={() => setShowDeleteNotaModal(false)}
        title="Confirmar Exclusão"
      >
        <div className="mb-4">
          <p>Tem certeza que deseja excluir esta nota?</p>
          <p className="text-red-600 font-medium mt-2">Esta ação não pode ser desfeita.</p>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowDeleteNotaModal(false)}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDeleteNota}
          >
            Confirmar Exclusão
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PerfilCliente;