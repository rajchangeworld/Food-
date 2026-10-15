import React from 'react';
import { Flame } from 'lucide-react';

export default function LoadingScreen({ message = 'Checking your session...' }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0B0B0B',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      {/* Animated Brand Pulse */}
      <div
        style={{
          position: 'relative',
          width: '90px',
          height: '90px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(255,107,0,0.3) 0%, rgba(255,140,0,0.1) 100%)',
            animation: 'pulse 1.8s ease-in-out infinite',
          }}
        />
        <div
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(255, 107, 0, 0.45)',
          }}
        >
          <Flame size={40} color="#FFFFFF" />
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          Crave<span style={{ color: '#FF6B00' }}>Bite</span>
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#A3A3A3', fontWeight: 500 }}>
          {message}
        </p>
      </div>

      {/* Subtle loader bar */}
      <div
        style={{
          width: '140px',
          height: '3px',
          backgroundColor: '#222222',
          borderRadius: '4px',
          overflow: 'hidden',
          marginTop: '1.5rem',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#FF6B00',
            animation: 'shimmer 1.5s infinite linear',
          }}
        />
      </div>
    </div>
  );
}
