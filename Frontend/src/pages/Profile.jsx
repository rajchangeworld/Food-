import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { DEFAULT_USER_PROFILE } from '../data/mockMenu';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  HelpCircle,
  LogOut,
  Edit2,
  Plus,
  Trash2,
  Check,
  X,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Lock,
} from 'lucide-react';

export default function Profile() {
  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { setSelectedAddress } = useCart();
  const [profile, setProfile] = useState(user || DEFAULT_USER_PROFILE);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // null if adding new
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });
  const [addressForm, setAddressForm] = useState({
    tag: 'Home',
    street: '',
    landmark: '',
    city: '',
    pincode: '',
    isDefault: false,
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await apiService.fetchUserProfile();
      const baseData = res.data || user || DEFAULT_USER_PROFILE;
      const loggedPhone = user?.phone || baseData.phone || DEFAULT_USER_PROFILE.phone;

      const merged = {
        ...baseData,
        phone: loggedPhone,
      };

      setProfile(merged);
      setProfileForm({
        name: baseData.name || '',
        email: baseData.email || '',
        phone: loggedPhone,
      });
      setLoading(false);
    }
    load();
  }, [user]);

  const handleOpenEditProfile = () => {
    const loggedPhone = user?.phone || profile.phone;
    setProfileForm({
      name: profile.name,
      email: profile.email,
      phone: loggedPhone,
    });
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      showToast('Name is required', 'error');
      return;
    }
    if (!profileForm.email.includes('@')) {
      showToast('Valid email is required', 'error');
      return;
    }

    // Always preserve the registered login mobile number
    const lockedPhone = user?.phone || profile.phone;

    const updated = {
      ...profile,
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
      phone: lockedPhone,
    };

    setProfile(updated);
    apiService.updateUserProfile(updated);
    setShowEditProfileModal(false);
    showToast('Profile updated successfully!', 'success');
  };

  const handleOpenAddressModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setAddressForm({ ...address });
    } else {
      setEditingAddress(null);
      setAddressForm({
        tag: 'Home',
        street: '',
        landmark: '',
        city: 'Downtown Metro',
        pincode: '400020',
        isDefault: false,
      });
    }
    setShowAddressModal(true);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressForm.street.trim()) {
      showToast('Street address is required', 'error');
      return;
    }

    let updatedAddresses;
    if (editingAddress) {
      updatedAddresses = profile.addresses.map((a) =>
        a.id === editingAddress.id ? { ...addressForm, id: editingAddress.id } : a
      );
    } else {
      const newAddr = {
        ...addressForm,
        id: `addr-${Date.now()}`,
      };
      updatedAddresses = [...profile.addresses, newAddr];
    }

    const updatedProfile = { ...profile, addresses: updatedAddresses };
    setProfile(updatedProfile);
    apiService.updateUserProfile(updatedProfile);
    setShowAddressModal(false);
    showToast(editingAddress ? 'Address updated' : 'New address added', 'success');
  };

  const handleDeleteAddress = (id) => {
    if (profile.addresses.length <= 1) {
      showToast('You must keep at least one delivery address', 'error');
      return;
    }
    const updatedAddresses = profile.addresses.filter((a) => a.id !== id);
    const updatedProfile = { ...profile, addresses: updatedAddresses };
    setProfile(updatedProfile);
    apiService.updateUserProfile(updatedProfile);
    showToast('Address removed', 'info');
  };

  const handleSetDefaultAddress = (address) => {
    const updated = profile.addresses.map((a) => ({
      ...a,
      isDefault: a.id === address.id,
    }));
    const updatedProfile = { ...profile, addresses: updated };
    setProfile(updatedProfile);
    setSelectedAddress(address);
    apiService.updateUserProfile(updatedProfile);
    showToast(`Set "${address.tag}" as default delivery location`, 'success');
  };

  const handleTogglePreference = (key) => {
    const updatedPrefs = {
      ...profile.preferences,
      [key]: !profile.preferences?.[key],
    };
    const updated = { ...profile, preferences: updatedPrefs };
    setProfile(updated);
    apiService.updateUserProfile(updated);
    showToast('Preference updated', 'success');
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await authLogout();
    showToast('Logged out successfully', 'info');
    navigate('/login', { replace: true });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Profile Card */}
      <section
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Avatar with Glow */}
          <div style={{ position: 'relative' }}>
            <img
              src={profile.avatar}
              alt={profile.name}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--primary-orange)',
                boxShadow: '0 4px 20px rgba(255, 107, 0, 0.35)',
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
                {profile.name}
              </h1>
              {profile.isDemo && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(255, 107, 0, 0.15)',
                    border: '1px solid var(--primary-orange)',
                    color: 'var(--secondary-orange)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Demo Account
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Mail size={14} color="var(--primary-orange)" />
                <span>{profile.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Phone size={14} color="var(--primary-orange)" />
                <span>{profile.phone}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          id="edit-profile-btn"
          onClick={handleOpenEditProfile}
          className="btn-secondary"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
        >
          <Edit2 size={15} />
          <span>Edit Profile</span>
        </button>
      </section>

      {/* Saved Addresses Section */}
      <section
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
              Saved Delivery Addresses
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Manage addresses for quick 1-tap checkout
            </p>
          </div>

          <button
            type="button"
            id="add-address-btn"
            onClick={() => handleOpenAddressModal(null)}
            className="btn-outline"
            style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
          >
            <Plus size={15} />
            <span>Add New Address</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {profile.addresses.map((addr) => (
            <div
              key={addr.id}
              style={{
                backgroundColor: 'var(--bg-input)',
                border: `1px solid ${addr.isDefault ? 'var(--primary-orange)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.75rem',
                boxShadow: addr.isDefault ? 'var(--shadow-orange)' : 'none',
                position: 'relative',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} color="var(--primary-orange)" />
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF' }}>
                      {addr.tag}
                    </span>
                  </div>

                  {addr.isDefault && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: '#10B981',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      Default
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {addr.street}
                </p>
                {addr.landmark && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Landmark: {addr.landmark}
                  </p>
                )}
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {addr.city} {addr.pincode && `• ${addr.pincode}`}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {!addr.isDefault ? (
                  <button
                    type="button"
                    onClick={() => handleSetDefaultAddress(addr)}
                    style={{ fontSize: '0.78rem', color: 'var(--primary-orange)', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Set as Default
                  </button>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Selected</span>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenAddressModal(addr)}
                    style={{ color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                    title="Edit address"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(addr.id)}
                    style={{ color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                    title="Delete address"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Settings & Preferences */}
      <section
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
          Preferences & Support
        </h2>

        {/* Push notifications */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bell size={20} color="var(--primary-orange)" />
            <div>
              <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FFFFFF', display: 'block' }}>
                Push Notifications
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Receive real-time order status and discounts
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleTogglePreference('pushNotifications')}
            style={{
              width: '46px',
              height: '24px',
              borderRadius: '9999px',
              backgroundColor: profile.preferences?.pushNotifications ? 'var(--primary-orange)' : '#333',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                position: 'absolute',
                top: '3px',
                left: profile.preferences?.pushNotifications ? '25px' : '3px',
                transition: 'left 0.2s ease',
              }}
            />
          </button>
        </div>

        {/* SMS alerts */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Phone size={20} color="var(--secondary-orange)" />
            <div>
              <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FFFFFF', display: 'block' }}>
                SMS Order Updates
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Receive rider arrival updates on mobile
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleTogglePreference('smsAlerts')}
            style={{
              width: '46px',
              height: '24px',
              borderRadius: '9999px',
              backgroundColor: profile.preferences?.smsAlerts ? 'var(--primary-orange)' : '#333',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                position: 'absolute',
                top: '3px',
                left: profile.preferences?.smsAlerts ? '25px' : '3px',
                transition: 'left 0.2s ease',
              }}
            />
          </button>
        </div>

        {/* Help & Support Button */}
        <button
          type="button"
          onClick={() => setShowHelpModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 0',
            borderBottom: '1px solid var(--border-color)',
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <HelpCircle size={20} color="var(--primary-orange)" />
            <div>
              <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FFFFFF', display: 'block' }}>
                Help & 24/7 Customer Care
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                FAQ, refund queries, and live support team
              </span>
            </div>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </button>

        {/* Logout Row */}
        <div style={{ paddingTop: '0.5rem' }}>
          <button
            type="button"
            id="logout-button"
            onClick={() => setShowLogoutConfirm(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </section>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowEditProfileModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              maxWidth: '460px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>Edit Profile</h3>
              <button onClick={() => setShowEditProfileModal(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label htmlFor="edit-profile-phone" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Mobile Number
                  </label>
                  <span style={{ fontSize: '0.72rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                    <ShieldCheck size={13} /> Registered & Locked
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="edit-profile-phone"
                    type="tel"
                    value={user?.phone || profileForm.phone || profile.phone}
                    readOnly
                    disabled
                    aria-readonly="true"
                    style={{
                      width: '100%',
                      backgroundColor: '#1E1E1E',
                      color: '#A3A3A3',
                      cursor: 'not-allowed',
                      border: '1px solid #333333',
                      paddingRight: '36px',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#737373',
                      pointerEvents: 'none',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Lock size={15} />
                  </div>
                </div>
                <span style={{ fontSize: '0.73rem', color: '#737373', marginTop: '5px', display: 'block' }}>
                  Mobile number is linked to your login account and cannot be changed.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowEditProfileModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Address Add/Edit Modal */}
      {showAddressModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowAddressModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              maxWidth: '480px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button onClick={() => setShowAddressModal(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Address Label (e.g. Home, Office, Villa)
                </label>
                <input
                  type="text"
                  value={addressForm.tag}
                  onChange={(e) => setAddressForm({ ...addressForm, tag: e.target.value })}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Street / Flat / House Address
                </label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  placeholder="e.g. 42 Marine Drive, Apt 4B"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={addressForm.landmark}
                  onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                  placeholder="e.g. Opposite City Mall"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    City
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddressModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <LogOut size={26} />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
              Confirm Logout
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Are you sure you want to log out?
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button type="button" onClick={() => setShowLogoutConfirm(false)} className="btn-secondary">
                Stay Logged In
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-primary"
                style={{ backgroundColor: '#EF4444', borderColor: '#EF4444' }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {showHelpModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowHelpModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              maxWidth: '460px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={22} color="var(--primary-orange)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>CraveBite Support</h3>
              </div>
              <button onClick={() => setShowHelpModal(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <p>
                Have questions about your delivery, payments, or food safety? Our priority care team is active 24/7.
              </p>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ color: '#FFFFFF', display: 'block' }}>Email Support:</strong>
                <span>support@cravebite.app</span>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ color: '#FFFFFF', display: 'block' }}>Toll-Free Helpline:</strong>
                <span>+1 (800) 555-CRAVE (27283)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowHelpModal(false);
                showToast('Support ticket initiated. An agent will connect shortly.', 'info');
              }}
              className="btn-primary"
              style={{ width: '100%', marginTop: '1.25rem' }}
            >
              Start Live Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
