import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/shared/GlassCard';
import GlassButton from '../components/shared/GlassButton';
import GlassInput from '../components/shared/GlassInput';
import { Lock } from 'lucide-react';

const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (login(name, password)) {
            navigate('/');
        } else {
            setError('Invalid Name or Access Key');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'radial-gradient(circle at 50% 10%, #1a1a1a 0%, #000000 100%)'
        }}>
            <GlassCard style={{ width: '400px', textAlign: 'center', padding: '40px' }}>
                <div style={{ marginBottom: '24px', color: 'var(--color-gold-primary)' }}>
                    <Lock size={48} />
                </div>
                <h1 style={{
                    color: 'var(--color-text-main)',
                    marginBottom: '8px',
                    fontWeight: '300',
                    letterSpacing: '2px'
                }}>TRILOGY</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
                    Team Access Portal
                </p>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '16px' }}>
                        <GlassInput
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ textAlign: 'center' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <GlassInput
                            type="password"
                            placeholder="Access Key"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ textAlign: 'center', letterSpacing: '4px' }}
                            required
                        />
                    </div>
                    {error && <p style={{ color: '#ff4d4d', marginBottom: '16px' }}>{error}</p>}
                    <GlassButton type="submit" style={{ width: '100%' }}>
                        ENTER VAULT
                    </GlassButton>
                </form>
            </GlassCard>
        </div>
    );
};

export default Login;
