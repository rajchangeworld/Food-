import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, onClear, placeholder = 'Search dishes, burgers, biryani...' }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '14px',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none',
          color: 'var(--text-muted)',
        }}
      >
        <Search size={18} />
      </div>

      <input
        id="food-search-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          paddingLeft: '42px',
          paddingRight: value ? '42px' : '16px',
          height: '48px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          color: '#FFFFFF',
          fontSize: '0.95rem',
          outline: 'none',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all var(--transition-fast)',
        }}
        aria-label="Search for food items"
      />

      {value && (
        <button
          onClick={onClear}
          id="clear-search-button"
          type="button"
          style={{
            position: 'absolute',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface-elevated)',
            color: 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer',
          }}
          aria-label="Clear search input"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
