# Sistema de Gerenciamento Posto Licínio

Sistema desktop para gerenciamento de clientes e notas de venda para postos de gasolina, desenvolvido com Electron.js e React.

## Sobre o Projeto

O Posto Licínio é um sistema desktop desenvolvido para facilitar o gerenciamento de clientes e notas de vendas em postos de combustível. O foco principal é oferecer uma interface simples e intuitiva, permitindo que até mesmo usuários sem experiência técnica possam utilizar o sistema com facilidade.

### Principais Funcionalidades

- **Gestão de Clientes**: Cadastro de clientes pessoa física e jurídica, com informações completas de contato e histórico.
- **Gestão de Notas**: Registro de vendas com múltiplos produtos, valores, datas de compra e vencimento.
- **Dashboard**: Visualização rápida dos clientes e indicação de notas vencidas.
- **Segurança**: Sistema de autenticação com senha.
- **Backup**: Funcionalidades para backup e restauração de dados.

## Tecnologias Utilizadas

- **Electron.js**: Framework para criar aplicativos desktop usando tecnologias web
- **React**: Biblioteca JavaScript para construção de interfaces
- **TailwindCSS**: Framework CSS para estilização
- **Electron-Store**: Para armazenamento de dados local em formato JSON
- **React Router**: Para navegação entre páginas
- **React Icons**: Para ícones do sistema
- **Date-fns**: Para manipulação de datas
- **UUID**: Para geração de identificadores únicos


## Requisitos

- Node.js (v14 ou superior)
- npm ou yarn

## Instalação e Configuração

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/savioomio/sietama-LN-posto.git
   cd posto-licinio
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Execute em modo de desenvolvimento**:
   ```bash
   npm run electron:dev
   ```

4. **Construa para produção**:
   ```bash
   npm run electron:build
   ```

## Funcionalidades Detalhadas

### Autenticação
- Senha padrão inicial: `admin123`
- Possibilidade de alterar senha nas configurações

### Dashboard
- Visão geral dos clientes cadastrados
- Indicação visual de clientes com notas vencidas
- Acesso rápido às principais funcionalidades

### Gestão de Clientes
- Cadastro de pessoas físicas (CPF) e jurídicas (CNPJ)
- Armazenamento de informações de contato
- Histórico completo de notas por cliente

### Gestão de Notas
- Cadastro de notas com múltiplos produtos
- Cálculo automático de valores
- Definição de datas de compra e vencimento
- Status de pagamento (pago/pendente)
- Identificação visual de notas vencidas

### Configurações
- Alteração de senha de acesso
- Funções de backup e restauração

## Armazenamento de Dados

O sistema utiliza `electron-store` para armazenar dados localmente em formato JSON. Os dados são salvos em:

- **Windows**: `%APPDATA%\posto-licinio\`
- **macOS**: `~/Library/Application Support/posto-licinio/`
- **Linux**: `~/.config/posto-licinio/`

Os principais arquivos de dados são:
- `clientes.json` - Armazena todos os dados dos clientes
- `notas.json` - Armazena todas as notas de venda
- `config.json` - Armazena as configurações do sistema

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento React
- `npm run electron:dev` - Inicia o aplicativo Electron em modo de desenvolvimento
- `npm run build` - Compila o código React para produção
- `npm run electron:build` - Compila o aplicativo Electron para distribuição

## Licença

Este projeto é de uso exclusivo do Posto Licínio.

---

Desenvolvido por [Seu Nome] - 2025
