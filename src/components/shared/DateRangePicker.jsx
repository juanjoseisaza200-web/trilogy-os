import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

const DateRangePicker = ({ onChange, defaultRange = 'last7days' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState(defaultRange);
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');

    const presets = [
        { id: 'today', label: 'Today' },
        { id: 'yesterday', label: 'Yesterday' },
        { id: 'last7days', label: 'Last 7 Days' },
        { id: 'last30days', label: 'Last 30 Days' },
        { id: 'mtd', label: 'Month to Date' },
        { id: 'custom', label: 'Custom Range' },
    ];

    const getPresetDates = (presetId) => {
        const today = new Date();
        const start = new Date(today);
        const end = new Date(today);

        switch (presetId) {
            case 'today':
                break;
            case 'yesterday':
                start.setDate(today.getDate() - 1);
                end.setDate(today.getDate() - 1);
                break;
            case 'last7days':
                start.setDate(today.getDate() - 6);
                break;
            case 'last30days':
                start.setDate(today.getDate() - 29);
                break;
            case 'mtd':
                start.setDate(1);
                break;
            case 'custom':
                return { start: customStart ? new Date(customStart) : null, end: customEnd ? new Date(customEnd) : null };
            default:
                break;
        }
        return { start, end };
    };

    const handlePresetClick = (presetId) => {
        setSelectedPreset(presetId);
        if (presetId !== 'custom') {
            const range = getPresetDates(presetId);
            onChange(range);
            setIsOpen(false);
        }
    };

    const handleCustomApply = () => {
        if (customStart && customEnd) {
            onChange({ start: new Date(customStart), end: new Date(customEnd) });
            setIsOpen(false);
        }
    };

    const getDisplayText = () => {
        if (selectedPreset !== 'custom') {
            return presets.find(p => p.id === selectedPreset)?.label;
        }
        if (customStart && customEnd) {
            return `${customStart} to ${customEnd}`;
        }
        return 'Select Dates';
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--color-border-glass)',
                    color: 'var(--color-text-main)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 500
                }}
            >
                <CalendarIcon size={16} />
                {getDisplayText()}
                <ChevronDown size={16} style={{ color: 'var(--color-text-muted)', marginLeft: '4px' }} />
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    background: 'rgba(20, 20, 20, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--color-border-glass)',
                    borderRadius: '12px',
                    padding: '16px',
                    width: '300px',
                    zIndex: 100,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {presets.filter(p => p.id !== 'custom').map(preset => (
                            <button
                                key={preset.id}
                                onClick={() => handlePresetClick(preset.id)}
                                style={{
                                    background: selectedPreset === preset.id ? 'var(--color-gold-primary)' : 'rgba(255,255,255,0.05)',
                                    color: selectedPreset === preset.id ? '#000' : 'var(--color-text-main)',
                                    border: 'none',
                                    padding: '8px',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'background 0.2s'
                                }}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ height: '1px', background: 'var(--color-border-glass)', margin: '4px 0' }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="radio"
                                id="customRangeRadio"
                                name="dateRange"
                                checked={selectedPreset === 'custom'}
                                onChange={() => setSelectedPreset('custom')}
                                style={{ accentColor: 'var(--color-gold-primary)' }}
                            />
                            <label htmlFor="customRangeRadio" style={{ color: 'var(--color-text-main)', fontSize: '0.9rem' }}>Custom Range</label>
                        </div>

                        {selectedPreset === 'custom' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="date"
                                        value={customStart}
                                        onChange={(e) => setCustomStart(e.target.value)}
                                        style={{
                                            flex: 1,
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid var(--color-border-glass)',
                                            color: '#fff',
                                            padding: '8px',
                                            borderRadius: '6px',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer'
                                        }}
                                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                    />
                                    <input
                                        type="date"
                                        value={customEnd}
                                        onChange={(e) => setCustomEnd(e.target.value)}
                                        style={{
                                            flex: 1,
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid var(--color-border-glass)',
                                            color: '#fff',
                                            padding: '8px',
                                            borderRadius: '6px',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer'
                                        }}
                                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                    />
                                </div>
                                <button
                                    onClick={handleCustomApply}
                                    style={{
                                        background: 'var(--color-gold-primary)',
                                        color: '#000',
                                        border: 'none',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        marginTop: '4px'
                                    }}
                                >
                                    Apply Custom Range
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;
