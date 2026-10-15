import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, ArrowRight, ShieldCheck, Zap, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { requestOtp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Validate Indian mobile number format: 10 digits starting with 6, 7, 8, or 9
  const validateIndianNumber = (num) => {
    const cleaned = num.replace(/\D/g, '');
    return /^[6-9]\d{9}$/.test(cleaned);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber) {
      setError('Please enter your 10-digit mobile number');
      return;
    }

    if (!validateIndianNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit Indian mobile number (starts with 6-9)');
      return;
    }

    setIsSubmitting(true);
    const fullPhone = `+91${phoneNumber}`;

    try {
      const res = await requestOtp(fullPhone);
      showToast(res.message || 'OTP sent successfully!', 'success');
      navigate('/verify-otp');
    } catch (err) {
      setError(err.message || 'Failed to dispatch OTP. Please try again.');
      showToast(err.message || 'Failed to send OTP', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem',
        backgroundColor: '#0B0B0B',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Gradient Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '380px',
          height: '380px',
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.18) 0%, rgba(11, 11, 11, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Main Login Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#171717',
          border: '1px solid #282828',
          borderRadius: '24px',
          padding: '2.25rem 1.75rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65), 0 0 30px rgba(255, 107, 0, 0.08)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* App Logo & Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(255, 107, 0, 0.45)',
              marginBottom: '1rem',
            }}
          >
            <Flame size={36} color="#FFFFFF" />
          </div>

          <h1
            style={{
              fontSize: '1.85rem',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
              marginBottom: '0.4rem',
            }}
          >
            Crave<span style={{ color: '#FF6B00' }}>Bite</span>
          </h1>

          <p style={{ fontSize: '0.92rem', color: '#A3A3A3', lineHeight: 1.45, maxWidth: '320px', margin: '0 auto' }}>
            Enter your mobile number to get started with delicious food delivered hot & fresh.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label
              htmlFor="phone-input"
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#E5E5E5',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Mobile Number
            </label>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#222222',
                border: error ? '1.5px solid #EF4444' : '1.5px solid #333333',
                borderRadius: '14px',
                padding: '0.2rem 0.5rem',
                transition: 'border-color 0.2s ease',
              }}
            >
              {/* Country Code Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0.6rem 0.75rem',
                  backgroundColor: '#2A2A2A',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  marginRight: '0.5rem',
                }}
              >
                <span>🇮🇳</span>
                <span>+91</span>
              </div>

              {/* Number Input */}
              <input
                id="phone-input"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="Enter 10-digit number"
                value={phoneNumber}
                onChange={handlePhoneChange}
                maxLength={10}
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  padding: '0.6rem 0.2rem',
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '0.5rem',
                  color: '#EF4444',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                }}
              >
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            id="continue-btn"
            disabled={isSubmitting || phoneNumber.length < 10}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '0.9rem',
              fontSize: '1rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '14px',
              opacity: isSubmitting || phoneNumber.length < 10 ? 0.6 : 1,
              cursor: isSubmitting || phoneNumber.length < 10 ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              boxShadow: '0 6px 20px rgba(255, 107, 0, 0.35)',
            }}
          >
            {isSubmitting ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid #FFFFFF',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                <span>Sending OTP...</span>
              </div>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Feature Badges */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #262626',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#A3A3A3' }}>
            <Zap size={14} color="#FF6B00" />
            <span>Fast Delivery</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#A3A3A3' }}>
            <ShieldCheck size={14} color="#FF6B00" />
            <span>Secure OTP</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#A3A3A3' }}>
            <Sparkles size={14} color="#FF6B00" />
            <span>Best Offers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
