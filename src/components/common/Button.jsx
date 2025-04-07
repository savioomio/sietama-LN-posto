import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  onClick,
  disabled = false,
  className = '',
  ...rest
}) => {
  // Classes base para todos os botões
  const baseClasses = 'font-bold rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out';
  
  // Classes de variantes
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    info: 'bg-blue-500 hover:bg-blue-600 text-white',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100'
  };
  
  // Classes de tamanho
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg'
  };
  
  // Classes de largura
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Classes para botão desabilitado
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  // Combinação de todas as classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${disabledClasses} ${className}`;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;