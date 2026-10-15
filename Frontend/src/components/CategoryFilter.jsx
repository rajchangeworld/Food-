import React from 'react';

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        overflowX: 'auto',
        padding: '0.25rem 0',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
      role="tablist"
      aria-label="Food Categories"
    >
      {categories.map((cat) => {
        const isSelected =
          selectedCategory.toLowerCase() === cat.name.toLowerCase() ||
          (selectedCategory === 'All' && cat.name === 'All');

        return (
          <button
            key={cat.id}
            id={`category-tab-${cat.id}`}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectCategory(cat.name)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem',
              fontWeight: isSelected ? 700 : 500,
              whiteSpace: 'nowrap',
              border: isSelected
                ? '1px solid var(--primary-orange)'
                : '1px solid var(--border-color)',
              backgroundColor: isSelected
                ? 'var(--primary-orange)'
                : 'var(--bg-card)',
              color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
              boxShadow: isSelected ? 'var(--shadow-orange)' : 'none',
              transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
