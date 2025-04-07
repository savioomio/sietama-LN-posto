import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata um valor para moeda brasileira (Real - R$)
 * @param {number} valor - O valor a ser formatado
 * @returns {string} - O valor formatado como moeda (ex: R$ 1.234,56)
 */
export const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(valor);
};

/**
 * Formata uma data ISO para o formato brasileiro (dd/mm/yyyy)
 * @param {string|Date} data - Data em formato ISO ou objeto Date
 * @returns {string} - Data formatada (ex: 01/01/2023)
 */
export const formatarData = (data) => {
  if (!data) return '';
  
  const dataObj = typeof data === 'string' ? parseISO(data) : data;
  return format(dataObj, 'dd/MM/yyyy', { locale: ptBR });
};

/**
 * Formata um documento (CPF/CNPJ) para exibição
 * @param {string} documento - Número do documento sem formatação
 * @param {string} tipo - Tipo do documento ('fisica' para CPF, 'juridica' para CNPJ)
 * @returns {string} - Documento formatado
 */
export const formatarDocumento = (documento, tipo) => {
  if (!documento) return '';
  
  // Remove qualquer caractere não numérico
  const apenasNumeros = documento.replace(/\D/g, '');
  
  if (tipo === 'fisica' || apenasNumeros.length <= 11) {
    // Formatar CPF: 000.000.000-00
    return apenasNumeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    // Formatar CNPJ: 00.000.000/0000-00
    return apenasNumeros
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  }
};

/**
 * Formata um número de telefone
 * @param {string} telefone - Número de telefone sem formatação
 * @returns {string} - Telefone formatado (ex: (11) 98765-4321)
 */
export const formatarTelefone = (telefone) => {
  if (!telefone) return '';
  
  // Remove qualquer caractere não numérico
  const apenasNumeros = telefone.replace(/\D/g, '');
  
  if (apenasNumeros.length === 11) {
    // Celular: (00) 00000-0000
    return apenasNumeros
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  } else if (apenasNumeros.length === 10) {
    // Fixo: (00) 0000-0000
    return apenasNumeros
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  
  return apenasNumeros;
};