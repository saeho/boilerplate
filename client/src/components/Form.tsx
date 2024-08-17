'use client';

import { memo, useState } from 'react';
import { cn } from '../platform-agnostic/utils/string.ts';
import { Button } from './Button.tsx';
import i18n from '../platform-agnostic/i18n/index.ts';
import './Form.css';

/**
 * Types
 */

type InputProps = {
  className?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
};

type SearchBarProps = {
  initialValue?: string;
  buttonText?: string;
  onSearch: (searchInput: string) => void;
};

/**
 * Input
 */

export const Input = memo((p: InputProps) => {
  const { className, value, onChangeText } = p;

  // WRite a function for onSubmit when enter is pressed

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && p.onSubmit) {
      p.onSubmit();
    }
  };


  return <input
    className={cn('r_s', className)}
    type='text'
    value={value}
    onChange={e => onChangeText(e.target.value)}
    onKeyPress={onKeyPress}
  />;
});

Input.displayName = 'Input';

/**
 * Search bar
 */

export const SearchBar = memo((p: SearchBarProps) => {
  const { buttonText, onSearch, initialValue } = p;
  const [searchInput, setSearchInput] = useState(initialValue || '');

  const onSubmit = () => {
    onSearch(searchInput);
  };

  return <div className='h_item'>
    <Input
      className='f'
      value={searchInput}
      onChangeText={setSearchInput}
      onSubmit={onSubmit}
    />
    <Button
      onClick={() => onSearch(searchInput)}
      className='bg_primary m_s_l'
      text={buttonText || i18n.t('form.search')}
    />
  </div>;
});

SearchBar.displayName = 'SearchBar';
