import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiUser, FiFileText, FiEdit } from 'react-icons/fi';
import { formatarDocumento, formatarTelefone } from '../../utils/formatters';

const ClienteCard = ({ cliente, notasVencidas }) => {
  if (!cliente) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-primary-100 mr-4">
            <FiUser className="text-primary-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{cliente.nome}</h2>
            <p className="text-gray-600">
              {cliente.tipo === 'fisica' ? 'CPF: ' : 'CNPJ: '}
              {formatarDocumento(cliente.documento, cliente.tipo)}
            </p>
          </div>
        </div>
        
        <Link 
          to={`/clientes/editar/${cliente.id}`}
          className="text-primary-600 hover:text-primary-700"
        >
          <FiEdit size={20} />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">Tipo de Cliente</p>
          <p className="font-medium">
            {cliente.tipo === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Data de Cadastro</p>
          <p className="font-medium">
            {format(new Date(cliente.dataCadastro), 'dd/MM/yyyy', { locale: ptBR })}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Endereço</p>
          <p className="font-medium">{cliente.endereco || 'Não informado'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Telefone</p>
          <p className="font-medium">
            {cliente.telefone ? formatarTelefone(cliente.telefone) : 'Não informado'}
          </p>
        </div>
      </div>
      
      {notasVencidas && notasVencidas.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiFileText className="text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Este cliente possui {notasVencidas.length} {notasVencidas.length === 1 ? 'nota vencida' : 'notas vencidas'}.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <Link to={`/notas/cadastro/${cliente.id}`} className="text-primary-600 hover:text-primary-700 font-medium">
          + Nova Nota
        </Link>
      </div>
    </div>
  );
};

export default ClienteCard;