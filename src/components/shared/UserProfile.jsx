import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import GlassModal from './GlassModal';
import GlassInput from './GlassInput';
import GlassButton from './GlassButton';

const UserProfile = () => {
    const { user, role, updateRole, logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempRole, setTempRole] = useState(role || '');

    if (!user) return null;

    const handleSave = (e) => {
        e.preventDefault();
        updateRole(tempRole);
        setIsModalOpen(false);
    };

    const handleOpen = () => {
        setTempRole(role || '');
        setIsModalOpen(true);
    };

    return (
        <>
            <div
                onClick={handleOpen}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                }}
            >
                <div style={{ textAlign: 'right' }}>
                    <div style={{
                        color: 'var(--color-text-main)',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                    }}>
                        {user}
                    </div>
                    {role && (
                        <div style={{
                            color: 'var(--color-gold-primary)',
                            fontSize: '0.75rem',
                            marginTop: '2px',
                            fontWeight: '500'
                        }}>
                            {role}
                        </div>
                    )}
                    {!role && (
                        <div style={{
                            color: 'var(--color-text-muted)',
                            fontSize: '0.75rem',
                            marginTop: '2px',
                            fontStyle: 'italic'
                        }}>
                            Set Role
                        </div>
                    )}
                </div>

                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-gold-primary), #b08d55)',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                }}>
                    {user.charAt(0).toUpperCase()}
                </div>
            </div>

            <GlassModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Edit User Profile"
            >
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: 'var(--color-gold-primary)',
                            color: '#000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                        }}>
                            {user.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: 'var(--color-text-main)' }}>{user}</h3>
                            <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                Team Member
                            </p>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                            Your Role / Title
                        </label>
                        <GlassInput
                            value={tempRole}
                            onChange={(e) => setTempRole(e.target.value)}
                            placeholder="e.g. CFO, Designer, Developer"
                            autoFocus
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                            This will appear on your profile badge.
                        </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <GlassButton type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </GlassButton>
                        <GlassButton type="submit" variant="primary">
                            Save Profile
                        </GlassButton>
                    </div>
                </form>

                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={() => {
                            logout();
                            setIsModalOpen(false);
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ff4d4d',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            opacity: 0.8,
                            transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                    >
                        Sign Out
                    </button>
                </div>
            </GlassModal>
        </>
    );
};

export default UserProfile;
