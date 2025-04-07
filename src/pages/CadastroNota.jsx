import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import { format, addDays } from 'date-fns';

import Header from '../components/common/Header';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useCliente } from '../contexts/ClienteContext';
import { useNota } from '../contexts/NotaContext';

const CadastroNota = () => {
  const navigate = useNavigate();
  const { id, clienteId } = useParams();
  const { clientes, loadClientes } = useCliente();
  const { getNotaById, createNota, updateNota } = useNota();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  
  const produtosIniciais = [
    { nome: 'Diesel Comum', valor: 0, quantidade: 0 },
  ];
  
  const [formData, setFormData] = useState({
    clienteId: clienteId || '',
    dataCompra: format(new Date(), 'yyyy-MM-dd'),
    dataVencimento: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    produtos: produtosIniciais,
    valor: 0,
    status: 'pendente'
  });
  
  const [errors, setErrors] = useState({});

  // Carregar clientes
  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

  // Carregar nota se estiver editando
  useEffect(() => {
    const loadNota = async () => {
      if (id) {
        setIsEditing(true);
        setLoading(true);
        
        try {
          const nota = await getNotaById(id);
          if (nota) {
            // Converte as datas para o formato adequado para inputs date
            const dataCompra = format(new Date(nota.dataCompra), 'yyyy-MM-dd');
            const dataVencimento = format(new Date(nota.dataVencimento), 'yyyy-MM-dd');
            
            // Certifica-se de que produtos é um array
            let produtos = nota.produtos;
            if (typeof produtos === 'string') {
              produtos = JSON.parse(produtos);
            }
            
            setFormData({
              clienteId: nota.clienteId,
              dataCompra,
              dataVencimento,
              produtos,
              valor: nota.valor,
              status: nota.status
            });
          }
        } catch (error) {
          console.error('Erro ao carregar nota:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadNota();
  }, [id]);

  // Atualiza cliente selecionado quando o clienteId muda
  useEffect(() => {
    if (formData.clienteId && clientes.length > 0) {
      const cliente = clientes.find(c => c.id === formData.clienteId);
      setClienteSelecionado(cliente || null);
    }
  }, [formData.clienteId, clientes]);

  // Calcular valor total da nota quando produtos mudam
  useEffect(() => {
    const calcularValorTotal = () => {
      const total = formData.produtos.reduce((sum, produto) => {
        return sum + (produto.valor * produto.quantidade);
      }, 0);
      
      setFormData(prev => ({ ...prev, valor: total }));
    };
    
    calcularValorTotal();
  }, [formData.produtos]);

  // Handlers para alterações no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpa o erro quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleClienteChange = (e) => {
    const clienteId = e.target.value;
    setFormData(prev => ({ ...prev, clienteId }));
    
    const cliente = clientes.find(c => c.id === clienteId);
    setClienteSelecionado(cliente || null);
    
    if (errors.clienteId) {
      setErrors(prev => ({ ...prev, clienteId: '' }));
    }
  };

  const handleProdutoChange = (index, field, value) => {
    const novosProdutos = [...formData.produtos];
    
    // Trata-se de um campo numérico
    if (field === 'valor' || field === 'quantidade') {
      value = parseFloat(value) || 0;
    }
    
    novosProdutos[index][field] = value;
    
    setFormData(prev => ({
      ...prev,
      produtos: novosProdutos
    }));
  };

  const adicionarProduto = () => {
    setFormData(prev => ({
      ...prev,
      produtos: [...prev.produtos, { nome: '', valor: 0, quantidade: 0 }]
    }));
  };

  const removerProduto = (index) => {
    const novosProdutos = [...formData.produtos];
    novosProdutos.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      produtos: novosProdutos
    }));
  };

  // Validação do formulário
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.clienteId) {
      newErrors.clienteId = 'Selecione um cliente';
    }
    
    if (!formData.dataCompra) {
      newErrors.dataCompra = 'Data de compra é obrigatória';
    }
    
    if (!formData.dataVencimento) {
      newErrors.dataVencimento = 'Data de vencimento é obrigatória';
    }
    
    if (formData.produtos.length === 0) {
      newErrors.produtos = 'Adicione pelo menos um produto';
    } else {
      formData.produtos.forEach((produto, index) => {
        if (!produto.nome) {
          if (!newErrors.produtos) newErrors.produtos = {};
          newErrors.produtos[`${index}-nome`] = 'Nome do produto é obrigatório';
        }
        
        if (produto.valor <= 0) {
          if (!newErrors.produtos) newErrors.produtos = {};
          newErrors.produtos[`${index}-valor`] = 'Valor deve ser maior que zero';
        }
        
        if (produto.quantidade <= 0) {
          if (!newErrors.produtos) newErrors.produtos = {};
          newErrors.produtos[`${index}-quantidade`] = 'Quantidade deve ser maior que zero';
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepara os dados para envio
      const notaData = {
        ...formData,
        // Converte strings de data para objetos Date
        dataCompra: new Date(formData.dataCompra).toISOString(),
        dataVencimento: new Date(formData.dataVencimento).toISOString()
      };
      
      if (isEditing) {
        await updateNota(id, notaData);
      } else {
        await createNota(notaData);
      }
      
      // Redireciona para a página do cliente
      navigate(`/clientes/${formData.clienteId}`);
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto py-6 px-4">
        <div className="mb-6 flex items-center">
          <Button
            variant="outline"
            className="mr-4"
            onClick={() => navigate(clienteId ? `/clientes/${clienteId}` : '/')}
          >
            <FiArrowLeft className="mr-2" /> Voltar
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Editar Nota' : 'Cadastrar Nova Nota'}
          </h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="text-center py-4">
              <p>Carregando...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Informações da Nota</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="clienteId" className="form-label">
                      Cliente <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="clienteId"
                      name="clienteId"
                      value={formData.clienteId}
                      onChange={handleClienteChange}
                      className={`input-primary ${errors.clienteId ? 'border-red-500' : ''}`}
                      disabled={isEditing || Boolean(clienteId)}
                      required
                    >
                      <option value="">Selecione um cliente</option>
                      {clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nome} - {cliente.documento}
                        </option>
                      ))}
                    </select>
                    {errors.clienteId && (
                      <p className="text-red-500 text-xs italic mt-1">{errors.clienteId}</p>
                    )}
                  </div>
                  
                  {clienteSelecionado && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600 mb-1">Cliente Selecionado:</p>
                      <p className="font-medium">{clienteSelecionado.nome}</p>
                      <p className="text-sm text-gray-500">
                        {clienteSelecionado.tipo === 'fisica' ? 'CPF: ' : 'CNPJ: '}
                        {clienteSelecionado.documento}
                      </p>
                    </div>
                  )}
                  
                  <Input
                    id="dataCompra"
                    name="dataCompra"
                    type="date"
                    label="Data de Compra"
                    value={formData.dataCompra}
                    onChange={handleChange}
                    error={errors.dataCompra}
                    required
                  />
                  
                  <Input
                    id="dataVencimento"
                    name="dataVencimento"
                    type="date"
                    label="Data de Vencimento"
                    value={formData.dataVencimento}
                    onChange={handleChange}
                    error={errors.dataVencimento}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Produtos</h2>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={adicionarProduto}
                    className="flex items-center"
                  >
                    <FiPlus className="mr-1" /> Adicionar Produto
                  </Button>
                </div>
                
                {errors.produtos && typeof errors.produtos === 'string' && (
                  <p className="text-red-500 text-sm mb-2">{errors.produtos}</p>
                )}
                
                <div className="space-y-4">
                  {formData.produtos.map((produto, index) => (
                    <div key={index} className="flex flex-wrap md:flex-nowrap items-end gap-2 p-3 border rounded-md bg-gray-50">
                      <div className="w-full md:w-6/12">
                        <label className="form-label" htmlFor={`produto-${index}-nome`}>
                          Produto
                        </label>
                        <input
                          id={`produto-${index}-nome`}
                          type="text"
                          value={produto.nome}
                          onChange={(e) => handleProdutoChange(index, 'nome', e.target.value)}
                          className={`input-primary ${errors.produtos && errors.produtos[`${index}-nome`] ? 'border-red-500' : ''}`}
                          placeholder="Nome do produto"
                        />
                        {errors.produtos && errors.produtos[`${index}-nome`] && (
                          <p className="text-red-500 text-xs italic mt-1">{errors.produtos[`${index}-nome`]}</p>
                        )}
                      </div>
                      
                      <div className="w-full md:w-2/12">
                        <label className="form-label" htmlFor={`produto-${index}-valor`}>
                          Valor Unit.
                        </label>
                        <input
                          id={`produto-${index}-valor`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={produto.valor}
                          onChange={(e) => handleProdutoChange(index, 'valor', e.target.value)}
                          className={`input-primary ${errors.produtos && errors.produtos[`${index}-valor`] ? 'border-red-500' : ''}`}
                        />
                        {errors.produtos && errors.produtos[`${index}-valor`] && (
                          <p className="text-red-500 text-xs italic mt-1">{errors.produtos[`${index}-valor`]}</p>
                        )}
                      </div>
                      
                      <div className="w-full md:w-2/12">
                        <label className="form-label" htmlFor={`produto-${index}-quantidade`}>
                          Quantidade
                        </label>
                        <input
                          id={`produto-${index}-quantidade`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={produto.quantidade}
                          onChange={(e) => handleProdutoChange(index, 'quantidade', e.target.value)}
                          className={`input-primary ${errors.produtos && errors.produtos[`${index}-quantidade`] ? 'border-red-500' : ''}`}
                        />
                        {errors.produtos && errors.produtos[`${index}-quantidade`] && (
                          <p className="text-red-500 text-xs italic mt-1">{errors.produtos[`${index}-quantidade`]}</p>
                        )}
                      </div>
                      
                      <div className="w-full md:w-2/12 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Subtotal:</p>
                          <p className="font-bold">
                            {new Intl.NumberFormat('pt-BR', { 
                              style: 'currency', 
                              currency: 'BRL' 
                            }).format(produto.valor * produto.quantidade)}
                          </p>
                        </div>
                        
                        {formData.produtos.length > 1 && (
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removerProduto(index)}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-gray-100 rounded-md flex justify-end">
                  <div className="text-right">
                    <p className="text-lg font-semibold">Valor Total:</p>
                    <p className="text-2xl font-bold text-primary-700">
                      {new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(formData.valor)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center"
                >
                  <FiSave className="mr-2" />
                  {isEditing ? 'Salvar Alterações' : 'Cadastrar Nota'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default CadastroNota;