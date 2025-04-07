import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiFileText, FiCalendar, FiDollarSign, FiEdit } from 'react-icons/fi';
import { formatarMoeda } from '../../utils/formatters';

const NotaCard = ({ nota, onUpdateStatus }) => {
  if (!nota) return null;

  const dataCompra = new Date(nota.dataCompra);
  const dataVencimento = new Date(nota.dataVencimento);
  const hoje = new Date();
  const estaVencida = dataVencimento < hoje && nota.status === 'pendente';
  
  // Converte produtos de JSON para Array se necessário
  let produtos = nota.produtos;
  if (typeof produtos === 'string') {
    try {
      produtos = JSON.parse(produtos);
    } catch (error) {
      console.error('Erro ao parsear produtos:', error);
      produtos = [];
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${estaVencida ? 'border-l-4 border-red-500' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-secondary-100 mr-4">
            <FiFileText className="text-secondary-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Nota {nota.id.substring(0, 8).toUpperCase()}
            </h2>
            <p className="text-gray-600">
              Cliente: {nota.clienteNome || ''}
            </p>
          </div>
        </div>
        
        <Link 
          to={`/notas/editar/${nota.id}`}
          className="text-primary-600 hover:text-primary-700"
        >
          <FiEdit size={20} />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center">
          <FiCalendar className="text-gray-500 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Data de Compra</p>
            <p className="font-medium">
              {format(dataCompra, 'dd/MM/yyyy', { locale: ptBR })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <FiCalendar className="text-gray-500 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Data de Vencimento</p>
            <p className={`font-medium ${estaVencida ? 'text-red-600' : ''}`}>
              {format(dataVencimento, 'dd/MM/yyyy', { locale: ptBR })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <FiDollarSign className="text-gray-500 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Valor Total</p>
            <p className="font-medium text-lg">{formatarMoeda(nota.valor)}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">Produtos</h3>
        <div className="bg-gray-50 rounded-md p-3">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500">Produto</th>
                <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Quantidade</th>
                <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Valor Unit.</th>
                <th className="px-2 py-2 text-right text-xs font-medium text-gray-500">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(produtos) && produtos.map((produto, index) => (
                <tr key={index}>
                  <td className="px-2 py-2 text-sm text-gray-900">{produto.nome}</td>
                  <td className="px-2 py-2 text-sm text-gray-900 text-right">{produto.quantidade}</td>
                  <td className="px-2 py-2 text-sm text-gray-900 text-right">
                    {formatarMoeda(produto.valor)}
                  </td>
                  <td className="px-2 py-2 text-sm font-medium text-gray-900 text-right">
                    {formatarMoeda(produto.valor * produto.quantidade)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            nota.status === 'paga' 
              ? 'bg-green-100 text-green-800' 
              : estaVencida
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
          }`}>
            {nota.status === 'paga' ? 'Paga' : estaVencida ? 'Vencida' : 'Pendente'}
          </span>
        </div>
        
        {onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus(nota.id, nota.status === 'paga' ? 'pendente' : 'paga')}
            className={`py-1 px-3 text-sm font-medium rounded ${
              nota.status === 'paga'
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            {nota.status === 'paga' ? 'Marcar como Pendente' : 'Marcar como Paga'}
          </button>
        )}
      </div>
    </div>
  );
};

export default NotaCard;