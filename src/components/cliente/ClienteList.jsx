import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiAlertCircle, FiEdit, FiEye } from 'react-icons/fi';
import { formatarDocumento } from '../../utils/formatters';

const ClienteList = ({ clientes, clientesComNotasVencidas, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-4">
        <p>Carregando clientes...</p>
      </div>
    );
  }

  if (clientes.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Nenhum cliente encontrado</p>
      </div>
    );
  }

  return (
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
          {clientes.map((cliente) => (
            <tr key={cliente.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{cliente.nome}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-gray-500">
                  {formatarDocumento(cliente.documento, cliente.tipo)}
                </div>
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
                <div className="flex justify-end space-x-2">
                  <Link 
                    to={`/clientes/${cliente.id}`}
                    className="text-primary-600 hover:text-primary-900"
                    title="Ver detalhes"
                  >
                    <FiEye />
                  </Link>
                  <Link 
                    to={`/clientes/editar/${cliente.id}`}
                    className="text-blue-600 hover:text-blue-900"
                    title="Editar cliente"
                  >
                    <FiEdit />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClienteList;