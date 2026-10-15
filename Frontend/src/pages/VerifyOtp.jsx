import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Zap,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function VerifyOtp() {
  const { pendingPhone, verifyOtp, requestOtp, latestDevOtp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const inputRefs = useRef([]);

  // Redirect to login if user arrived here without entering phone number first
  useEffect(() => {
    if (!pendingPhone) {
      navigate('/login', { replace: true });
    }
  }, [pendingPhone, navigate]);

  // Resend cooldown timer countdown
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Auto-focus first input box
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // When latestDevOtp changes, show notification again
  useEffect(() => {
    if (latestDevOtp) {
      setShowNotification(true);
    }
  }, [latestDevOtp]);

  const handleInputChange = (index, value) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, '');
    const newValues = [...otpValues];

    if (!cleaned) {
      newValues[index] = '';
      setOtpValues(newValues);
      return;
    }

    // Handle single digit
    newValues[index] = cleaned[cleaned.length - 1];
    setOtpValues(newValues);
    if (error) setError('');

    // Advance focus to next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newValues = [...otpValues];
    for (let i = 0; i < 6; i++) {
      newValues[i] = pastedData[i] || '';
    }
    setOtpValues(newValues);
    if (error) setError('');

    const nextIdx = Math.min(pastedData.length, 5);
    inputRefs.current[nextIdx]?.focus();
  };

  const handleAutoFill = () => {
    const code = latestDevOtp || '123456';
    const digits = code.split('').slice(0, 6);
    setOtpValues(digits);
    setError('');
    showToast(`Auto-filled code: ${code}`, 'success');
    inputRefs.current[5]?.focus();
  };

  const handleCopyCode = (e) => {
    e.stopPropagation();
    const code = latestDevOtp || '123456';
    navigator.clipboard.writeText(code).catch(() => {});
    setIsCopied(true);
    showToast('OTP copied to clipboard', 'info');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const fullOtp = otpValues.join('');

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (fullOtp.length < 6) {
      setError('Please enter all 6 digits of the OTP code');
      return;
    }

    setError('');
    setIsVerifying(true);

    try {
      await verifyOtp(fullOtp);
      showToast('Login successful! Welcome to CraveBite.', 'success');
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Incorrect OTP code. Please check and try again.');
      showToast(err.message || 'Verification failed', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || isResending) return;

    setIsResending(true);
    setError('');

    try {
      await requestOtp(pendingPhone);
      setCooldown(60);
      setOtpValues(['', '', '', '', '', '']);
      setShowNotification(true);
      inputRefs.current[0]?.focus();
      showToast('A new OTP has been dispatched to your mobile.', 'success');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP. Please wait a moment.');
      showToast(err.message || 'Resend failed', 'error');
    } finally {
      setIsResending(false);
    }
  };

  // Masked phone format for UI display
  const maskedPhone = pendingPhone
    ? `${pendingPhone.slice(0, 6)}•••••${pendingPhone.slice(-2)}`
    : '';

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
      {/* 📱 Real-Time On-Screen SMS Push Notification Pop-Up */}
      {showNotification && (latestDevOtp || true) && (
        <aside
          aria-label="SMS Notification"
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: '1.25rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 2rem)',
            maxWidth: '460px',
            backgroundColor: 'rgba(23, 23, 23, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255, 107, 0, 0.5)',
            borderRadius: '20px',
            padding: '1rem 1.15rem',
            boxShadow: '0 16px 45px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 107, 0, 0.3)',
            zIndex: 1000,
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
          onClick={handleAutoFill}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '7px',
                  background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(255, 107, 0, 0.4)',
                }}
              >
                <MessageSquare size={13} color="#FFFFFF" />
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                }}
              >
                Messages • <span style={{ color: '#FF6B00' }}>now</span>
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNotification(false);
              }}
              aria-label="Dismiss notification"
              style={{
                background: 'none',
                border: 'none',
                color: '#737373',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: '#E5E5E5',
                  fontWeight: 600,
                  margin: '0 0 2px 0',
                  lineHeight: 1.35,
                }}
              >
                CraveBite code:{' '}
                <span
                  style={{
                    color: '#FF6B00',
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    padding: '1px 8px',
                    backgroundColor: 'rgba(255, 107, 0, 0.15)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 107, 0, 0.3)',
                    display: 'inline-block',
                  }}
                >
                  {latestDevOtp || '123456'}
                </span>
              </p>
              <span style={{ fontSize: '0.75rem', color: '#A3A3A3' }}>
                Tap here to auto-fill code instantly
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={handleCopyCode}
                title="Copy code"
                style={{
                  backgroundColor: '#2A2A2A',
                  color: '#FFFFFF',
                  border: '1px solid #3A3A3A',
                  borderRadius: '10px',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                {isCopied ? <Check size={14} color="#22C55E" /> : <Copy size={14} />}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAutoFill();
                }}
                className="btn-primary"
                style={{
                  padding: '0.5rem 0.95rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  borderRadius: '10px',
                  boxShadow: '0 4px 15px rgba(255, 107, 0, 0.4)',
                }}
              >
                Auto-Fill ⚡
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Background Decorative Gradient Orb */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '380px',
          height: '380px',
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.15) 0%, rgba(11, 11, 11, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#171717',
          border: '1px solid #282828',
          borderRadius: '24px',
          padding: '2.25rem 1.75rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/login')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#A3A3A3',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <ArrowLeft size={16} />
          <span>Edit Mobile Number</span>
        </button>

        {/* Header Icon */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.2) 0%, rgba(255, 140, 0, 0.05) 100%)',
              border: '1px solid rgba(255, 107, 0, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem',
            }}
          >
            <ShieldCheck size={32} color="#FF6B00" />
          </div>

          <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.4rem' }}>
            Verify OTP
          </h1>

          <p style={{ fontSize: '0.9rem', color: '#A3A3A3', lineHeight: 1.45 }}>
            We sent a 6-digit verification code to
            <br />
            <strong style={{ color: '#FFFFFF', letterSpacing: '0.04em' }}>{pendingPhone || maskedPhone}</strong>
          </p>
        </div>

        {/* On-Screen Fast OTP Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255, 107, 0, 0.08)',
            border: '1px solid rgba(255, 107, 0, 0.3)',
            borderRadius: '14px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="#FF6B00" />
            <div>
              <span style={{ fontSize: '0.72rem', color: '#A3A3A3', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Your OTP Code
              </span>
              <strong style={{ fontSize: '1.15rem', color: '#FFFFFF', letterSpacing: '0.12em' }}>
                {latestDevOtp || '123456'}
              </strong>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAutoFill}
            style={{
              backgroundColor: '#FF6B00',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)',
            }}
          >
            <span>Auto Fill</span>
            <Zap size={13} />
          </button>
        </div>

        {/* 6-Digit OTP Inputs */}
        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            onPaste={handlePaste}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            {otpValues.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                style={{
                  width: '48px',
                  height: '56px',
                  borderRadius: '12px',
                  backgroundColor: '#222222',
                  border: error ? '1.5px solid #EF4444' : digit ? '1.5px solid #FF6B00' : '1.5px solid #333333',
                  color: '#FFFFFF',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  textAlign: 'center',
                  outline: 'none',
                  transition: 'all 0.15s ease',
                  boxShadow: digit ? '0 0 12px rgba(255, 107, 0, 0.25)' : 'none',
                }}
              />
            ))}
          </div>

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#EF4444',
                fontSize: '0.84rem',
                fontWeight: 500,
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                padding: '0.6rem 0.75rem',
                borderRadius: '10px',
                border: '1px solid rgba(239, 68, 68, 0.25)',
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            id="verify-btn"
            disabled={isVerifying || fullOtp.length < 6}
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
              opacity: isVerifying || fullOtp.length < 6 ? 0.6 : 1,
              cursor: isVerifying || fullOtp.length < 6 ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 20px rgba(255, 107, 0, 0.35)',
              marginTop: '0.25rem',
            }}
          >
            {isVerifying ? (
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
                <span>Verifying Code...</span>
              </div>
            ) : (
              <>
                <CheckCircle2 size={18} />
                <span>Verify & Continue</span>
              </>
            )}
          </button>
        </form>

        {/* Resend Cooldown Option */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          {cooldown > 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#737373' }}>
              Resend code in <strong style={{ color: '#FF6B00' }}>{cooldown}s</strong>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending}
              style={{
                background: 'none',
                border: 'none',
                color: '#FF6B00',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
              }}
            >
              <RefreshCw size={14} className={isResending ? 'spin' : ''} />
              <span>{isResending ? 'Sending...' : 'Resend OTP'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
