import React from 'react';

const Input = ({
  id,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  labelClassName = '',
  ...rest
}) => {
  // Classes para o container
  const containerClasses = `form-group ${className}`;
  
  // Classes para o label
  const defaultLabelClasses = 'form-label';
  const combinedLabelClasses = `${defaultLabelClasses} ${labelClassName}`;
  
  // Classes para o input
  const defaultInputClasses = 'input-primary';
  const errorInputClasses = error ? 'border-red-500' : '';
  const disabledInputClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  const combinedInputClasses = `${defaultInputClasses} ${errorInputClasses} ${disabledInputClasses} ${inputClassName}`;
  
  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={id} className={combinedLabelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={combinedInputClasses}
        {...rest}
      />
      
      {error && (
        <p className="text-red-500 text-xs italic mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;