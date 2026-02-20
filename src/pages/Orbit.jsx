import React from 'react';
import GlassCard from '../components/shared/GlassCard';
import { Rocket } from 'lucide-react';

const Orbit = () => {
    return (
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ background: 'var(--color-gold-primary)', color: '#000', padding: '12px', borderRadius: '12px' }}>
                    <Rocket size={28} />
                </div>
                <div>
                    <h1 style={{ margin: 0, color: 'var(--color-gold-primary)', fontSize: '2rem' }}>Orbit</h1>
                    <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>E-commerce Command Center</p>
                </div>
            </div>

            {/* Placeholder Layout for Phase 1 */}
            <div style={{ display: 'flex', gap: '24px', flexDirection: window.innerWidth <= 768 ? 'column' : 'row' }}>
                <GlassCard style={{ flex: 2 }}>
                    <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-text-main)' }}>Sales Overview</h3>
                    <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', padding: '40px', textAlign: 'center' }}>
                        Global Date Picker & Sales KPIs coming here...
                    </div>
                </GlassCard>

                <GlassCard style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-text-main)' }}>Hero Products</h3>
                    <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', padding: '40px', textAlign: 'center' }}>
                        Product tracking coming here...
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Orbit;
