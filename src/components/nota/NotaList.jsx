import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiEdit, FiCheckCircle, FiXCircle, FiTrash2 } from 'react-icons/fi';
import { formatarMoeda } from '../../utils/formatters';

const NotaList = ({ 
  notas, 
  onUpdateStatus, 
  onDeleteClick, 
  filtroStatus = 'todas',
  onFiltroChange 
}) => {
  // Filtra notas com base no filtro selecionado
  const notasFiltradas = notas.filter(nota => {
    if (filtroStatus === 'pagas') return nota.status === 'paga';
    if (filtroStatus === 'pendentes') return nota.status === 'pendente';
    return true; // todas
  });

  if (notas.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma nota encontrada</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        {onFiltroChange && (
          <select
            value={filtroStatus}
            onChange={(e) => onFiltroChange(e.target.value)}
            className="input-primary py-1"
          >
            <option value="todas">Todas</option>
            <option value="pendentes">Pendentes</option>
            <option value="pagas">Pagas</option>
          </select>
        )}
      </div>
      
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
                    {formatarMoeda(nota.valor)}
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
                      {onUpdateStatus && (
                        <>
                          {nota.status === 'pendente' ? (
                            <button
                              onClick={() => onUpdateStatus(nota.id, 'paga')}
                              className="text-green-600 hover:text-green-900"
                              title="Marcar como paga"
                            >
                              <FiCheckCircle />
                            </button>
                          ) : (
                            <button
                              onClick={() => onUpdateStatus(nota.id, 'pendente')}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Marcar como pendente"
                            >
                              <FiXCircle />
                            </button>
                          )}
                        </>
                      )}
                      
                      <Link 
                        to={`/notas/editar/${nota.id}`}
                        className="text-primary-600 hover:text-primary-900"
                        title="Editar nota"
                      >
                        <FiEdit />
                      </Link>
                      
                      {onDeleteClick && (
                        <button
                          onClick={() => onDeleteClick(nota)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir nota"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotaList;