import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

import Header from '../components/common/Header';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useCliente } from '../contexts/ClienteContext';

const CadastroCliente = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getClienteById, createCliente, updateCliente } = useCliente();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    tipo: 'fisica',
    nome: '',
    documento: '',
    endereco: '',
    telefone: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadCliente = async () => {
      if (id) {
        setIsEditing(true);
        setLoading(true);
        
        try {
          const cliente = await getClienteById(id);
          if (cliente) {
            setFormData({
              tipo: cliente.tipo,
              nome: cliente.nome,
              documento: cliente.documento,
              endereco: cliente.endereco || '',
              telefone: cliente.telefone || ''
            });
          }
        } catch (error) {
          console.error('Erro ao carregar cliente:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadCliente();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpa o erro quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validação de campos obrigatórios
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.documento.trim()) {
      newErrors.documento = 'Documento é obrigatório';
    } else {
      // Validação de CPF (apenas números e tamanho)
      if (formData.tipo === 'fisica' && !/^\d{11}$/.test(formData.documento.replace(/[^\d]/g, ''))) {
        newErrors.documento = 'CPF inválido. Deve conter 11 dígitos numéricos';
      }
      
      // Validação de CNPJ (apenas números e tamanho)
      if (formData.tipo === 'juridica' && !/^\d{14}$/.test(formData.documento.replace(/[^\d]/g, ''))) {
        newErrors.documento = 'CNPJ inválido. Deve conter 14 dígitos numéricos';
      }
    }
    
    if (formData.telefone.trim() && !/^\d{10,11}$/.test(formData.telefone.replace(/[^\d]/g, ''))) {
      newErrors.telefone = 'Telefone inválido. Formato: (00) 00000-0000';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      if (isEditing) {
        await updateCliente(id, formData);
      } else {
        await createCliente(formData);
      }
      
      navigate('/');
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
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
            onClick={() => navigate('/')}
          >
            <FiArrowLeft className="mr-2" /> Voltar
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
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
                <h2 className="text-lg font-semibold mb-4">Tipo de Cliente</h2>
                
                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="tipo"
                      value="fisica"
                      checked={formData.tipo === 'fisica'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>Pessoa Física</span>
                  </label>
                  
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="tipo"
                      value="juridica"
                      checked={formData.tipo === 'juridica'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>Pessoa Jurídica</span>
                  </label>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Dados do Cliente</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="nome"
                    name="nome"
                    label={formData.tipo === 'fisica' ? 'Nome Completo' : 'Razão Social'}
                    value={formData.nome}
                    onChange={handleChange}
                    error={errors.nome}
                    required
                  />
                  
                  <Input
                    id="documento"
                    name="documento"
                    label={formData.tipo === 'fisica' ? 'CPF' : 'CNPJ'}
                    value={formData.documento}
                    onChange={handleChange}
                    error={errors.documento}
                    required
                  />
                  
                  <Input
                    id="endereco"
                    name="endereco"
                    label="Endereço"
                    value={formData.endereco}
                    onChange={handleChange}
                    error={errors.endereco}
                  />
                  
                  <Input
                    id="telefone"
                    name="telefone"
                    label="Telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    error={errors.telefone}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center"
                >
                  <FiSave className="mr-2" />
                  {isEditing ? 'Salvar Alterações' : 'Cadastrar Cliente'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default CadastroCliente;