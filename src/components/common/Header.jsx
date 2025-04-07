import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiLogOut, FiSettings } from 'react-icons/fi';

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-primary-700 text-white shadow-md">
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span>Posto Licínio</span>
        </Link>
        
        {/* Navegação */}
        <nav className="flex items-center space-x-4">
          <Link 
            to="/configuracoes" 
            className="text-white hover:text-primary-200 transition-colors"
            title="Configurações"
          >
            <FiSettings size={20} />
          </Link>
          
          <button
            onClick={logout}
            className="text-white hover:text-primary-200 transition-colors"
            title="Sair"
          >
            <FiLogOut size={20} />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;