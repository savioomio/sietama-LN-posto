import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ value, onChange, placeholder = 'Pesquisar...' }) => {
  return (
    <div className="relative w-full md:w-64">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input-primary pl-10 w-full"
      />
      <FiSearch className="absolute left-3 top-3 text-gray-400" />
    </div>
  );
};

export default SearchBar;