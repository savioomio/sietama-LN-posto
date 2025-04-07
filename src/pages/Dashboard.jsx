import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiUser, FiFileText, FiSearch, FiAlertCircle } from 'react-icons/fi';

import Header from '../components/common/Header';
import Button from '../components/common/Button';
import { useCliente } from '../contexts/ClienteContext';
import { useNota } from '../contexts/NotaContext';

const Dashboard = () => {
  const { clientes, loading: clientesLoading, searchClientes } = useCliente();
  const { notas, loading: notasLoading } = useNota();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClientes, setFilteredClientes] = useState([]);

  // Mapeia notas vencidas por cliente
  const [clientesComNotasVencidas, setClientesComNotasVencidas] = useState({});

  useEffect(() => {
    // Filtra clientes com base no termo de pesquisa
    if (!searchTerm.trim()) {
      setFilteredClientes(clientes);
    } else {
      const filtered = clientes.filter(cliente => 
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.documento.includes(searchTerm)
      );
      setFilteredClientes(filtered);
    }
  }, [clientes, searchTerm]);

  useEffect(() => {
    // Verifica notas vencidas para cada cliente
    if (!notasLoading && notas.length > 0) {
      const hoje = new Date();
      const notasVencidasPorCliente = {};
      
      notas.forEach(nota => {
        if (nota.status === 'pendente') {
          const dataVencimento = new Date(nota.dataVencimento);
          
          if (dataVencimento < hoje) {
            if (!notasVencidasPorCliente[nota.clienteId]) {
              notasVencidasPorCliente[nota.clienteId] = [];
            }
            notasVencidasPorCliente[nota.clienteId].push(nota);
          }
        }
      });
      
      setClientesComNotasVencidas(notasVencidasPorCliente);
    }
  }, [notas, notasLoading]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim().length >= 3) {
      await searchClientes(value);
    } else if (!value.trim()) {
      await searchClientes('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link to="/clientes/cadastro">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center cursor-pointer">
              <div className="bg-primary-100 p-4 rounded-full mr-4">
                <FiUser className="text-primary-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Cadastrar Clientes</h2>
                <p className="text-gray-600">Adicione novos clientes ao sistema</p>
              </div>
            </div>
          </Link>
          
          <Link to="/notas/cadastro">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center cursor-pointer">
              <div className="bg-secondary-100 p-4 rounded-full mr-4">
                <FiFileText className="text-secondary-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Cadastrar Notas</h2>
                <p className="text-gray-600">Registre novas notas de venda</p>
              </div>
            </div>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Clientes</h2>
            
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Pesquisar clientes..."
                value={searchTerm}
                onChange={handleSearch}
                className="input-primary pl-10"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          {clientesLoading ? (
            <div className="text-center py-4">
              <p>Carregando clientes...</p>
            </div>
          ) : filteredClientes.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">Nenhum cliente encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Cadastro
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
                  {filteredClientes.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{cliente.nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">{cliente.documento}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          cliente.tipo === 'fisica' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {cliente.tipo === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {format(new Date(cliente.dataCadastro), 'dd/MM/yyyy', { locale: ptBR })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {clientesComNotasVencidas[cliente.id] && (
                          <div className="flex items-center text-red-600">
                            <FiAlertCircle className="mr-1" />
                            <span>{clientesComNotasVencidas[cliente.id].length} notas vencidas</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          to={`/clientes/${cliente.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Ver Detalhes
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;