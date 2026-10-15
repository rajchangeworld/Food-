import React, { useState, useEffect, useMemo } from 'react';
import { CATEGORIES, MOCK_MENU } from '../data/mockMenu';
import { apiService } from '../services/api';
import FoodCard from '../components/FoodCard';
import CategoryFilter from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';
import LoadingSkeleton from '../components/LoadingSkeleton';
import FoodDetailModal from '../components/FoodDetailModal';
import { useCart } from '../context/CartContext';
import { Sparkles, Tag, ArrowRight, Frown, Utensils, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [activeModalFood, setActiveModalFood] = useState(null);
  const { applyPromo } = useCart();

  useEffect(() => {
    let isMounted = true;
    async function loadMenu() {
      setLoading(true);
      const res = await apiService.fetchMenuItems();
      if (isMounted) {
        setMenuItems(res.data || MOCK_MENU);
        setLoading(false);
      }
    }
    loadMenu();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter menu items based on category, search, and vegOnly toggle
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category match
      const matchesCategory =
        selectedCategory === 'All' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      // Veg filter match
      const matchesVeg = !vegOnly || item.isVeg === true;

      return matchesCategory && matchesSearch && matchesVeg;
    });
  }, [menuItems, selectedCategory, searchQuery, vegOnly]);

  // Featured and popular items for curated sections
  const featuredItems = useMemo(() => {
    return menuItems.filter((i) => i.isFeatured);
  }, [menuItems]);

  const handleApplyHeroOffer = () => {
    applyPromo('TASTY50');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setVegOnly(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Hero Offer Banner */}
      <section
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #1A1208 0%, #261608 50%, #150F07 100%)',
          border: '1px solid rgba(255, 107, 0, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 0 40px rgba(255, 107, 0, 0.08)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        aria-label="Promotional Announcement"
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem' }}>
          <div style={{ maxWidth: '520px', zIndex: 2 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                background: 'rgba(255, 107, 0, 0.15)',
                border: '1px solid var(--primary-orange)',
                color: 'var(--secondary-orange)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.75rem',
              }}
            >
              <Sparkles size={13} color="var(--primary-orange)" />
              <span>Limited Time Mega Deal</span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15, marginBottom: '0.5rem' }}>
              Craving Something Hot? Get <span style={{ color: 'var(--primary-orange)' }}>50% OFF</span>
            </h1>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
              Fresh hand-tossed pizzas, smoky Angus beef burgers & dum biryanis cooked to order and delivered in minutes.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                id="claim-hero-offer-btn"
                onClick={handleApplyHeroOffer}
                className="btn-primary"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
              >
                <Tag size={16} />
                <span>Apply Code: TASTY50</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <ShieldCheck size={16} color="#10B981" />
                <span>Min order $15 • 100% Contactless</span>
              </div>
            </div>
          </div>

          {/* Hero Banner Visual Floating Image */}
          <div
            style={{
              position: 'relative',
              width: '180px',
              height: '140px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="hero-badge-container"
          >
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80"
              alt="Delicious Burger Promotion"
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--primary-orange)',
                boxShadow: '0 8px 30px rgba(255, 107, 0, 0.4)',
              }}
            />
          </div>
        </div>
      </section>

      {/* Search and Dietary Filter Bar */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search burgers, pizzas, biryani, or drinks..."
            />
          </div>

          {/* Veg Only Toggle Button */}
          <button
            type="button"
            id="veg-only-filter-toggle"
            onClick={() => setVegOnly(!vegOnly)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 1rem',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: vegOnly ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)',
              border: `1px solid ${vegOnly ? '#10B981' : 'var(--border-color)'}`,
              color: vegOnly ? '#10B981' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
          >
            <div className={`diet-indicator veg`}>
              <div className="diet-dot" />
            </div>
            <span>Veg Only</span>
          </button>
        </div>

        {/* Categories Bar */}
        <CategoryFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />
      </section>

      {/* Loading State */}
      {loading ? (
        <LoadingSkeleton type="food" count={6} />
      ) : (
        <>
          {/* Main Menu Grid / Filter Results */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory === 'All' ? 'Popular Dishes' : `${selectedCategory} Specials`}
                </h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Showing {filteredItems.length} delicious {filteredItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {(searchQuery || selectedCategory !== 'All' || vegOnly) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--primary-orange)',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Empty State when no items match */}
            {filteredItems.length === 0 ? (
              <div
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '3rem 1.5rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  marginTop: '1rem',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-input)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                  }}
                >
                  <Frown size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.25rem' }}>
                    No yummy dishes match your search
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '360px' }}>
                    Try searching for something else like "Angus Burger", "Truffle Pizza", or "Lassi", or reset filters.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="btn-primary"
                  style={{ marginTop: '0.5rem' }}
                >
                  <Utensils size={16} />
                  <span>Explore Full Menu</span>
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {filteredItems.map((food) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                    onClickDetails={(f) => setActiveModalFood(f)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Featured Dishes Section (Shown when browsing default All) */}
          {selectedCategory === 'All' && !searchQuery && !vegOnly && featuredItems.length > 0 && (
            <section style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--orange-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Sparkles size={16} color="var(--primary-orange)" />
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
                    Chef's Handpicked Specials
                  </h2>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {featuredItems.slice(0, 3).map((food) => (
                  <FoodCard
                    key={`featured-${food.id}`}
                    food={food}
                    onClickDetails={(f) => setActiveModalFood(f)}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Food Details Modal */}
      {activeModalFood && (
        <FoodDetailModal
          food={activeModalFood}
          onClose={() => setActiveModalFood(null)}
        />
      )}
    </div>
  );
}
