import React from 'react';

const SearchBar = ({ searchOnFocus, searchOutFocus, searchPeople }) => {
  return (
    <div className='box-search px-2 mb-4 position-relative'>
      <svg
        className='center-icon'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
      >
        <path d='M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z'></path>
      </svg>
      <input
        type='search'
        className='w-full px-12 py-2 bg-gray-200 text-gray-700 rounded-full outline-none'
        placeholder='Tìm kiếm user'
        onFocus={() => searchOnFocus()}
        onBlur={event => searchOutFocus(event)}
        onChange={event => {
          searchPeople(event.target.value);
        }}
      />
    </div>
  );
};

export default SearchBar;
