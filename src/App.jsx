import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ClienteProvider } from './contexts/ClienteContext';
import { NotaProvider } from './contexts/NotaContext';
import { ConfigProvider } from './contexts/ConfigContext';

// Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CadastroCliente from './pages/CadastroCliente';
import CadastroNota from './pages/CadastroNota';
import PerfilCliente from './pages/PerfilCliente';
import Configuracoes from './pages/Configuracoes';

// Rota protegida
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ConfigProvider>
          <ClienteProvider>
            <NotaProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/clientes/cadastro" element={
                  <ProtectedRoute>
                    <CadastroCliente />
                  </ProtectedRoute>
                } />
                
                <Route path="/clientes/editar/:id" element={
                  <ProtectedRoute>
                    <CadastroCliente />
                  </ProtectedRoute>
                } />
                
                <Route path="/clientes/:id" element={
                  <ProtectedRoute>
                    <PerfilCliente />
                  </ProtectedRoute>
                } />
                
                <Route path="/notas/cadastro" element={
                  <ProtectedRoute>
                    <CadastroNota />
                  </ProtectedRoute>
                } />
                
                <Route path="/notas/cadastro/:clienteId" element={
                  <ProtectedRoute>
                    <CadastroNota />
                  </ProtectedRoute>
                } />
                
                <Route path="/notas/editar/:id" element={
                  <ProtectedRoute>
                    <CadastroNota />
                  </ProtectedRoute>
                } />
                
                <Route path="/configuracoes" element={
                  <ProtectedRoute>
                    <Configuracoes />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </NotaProvider>
          </ClienteProvider>
        </ConfigProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;