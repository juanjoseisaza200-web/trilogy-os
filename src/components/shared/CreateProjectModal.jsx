import React, { useState } from 'react';
import GlassModal from './GlassModal';
import GlassInput from './GlassInput';
import GlassButton from './GlassButton';
import airtableService from '../../services/airtable';

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
    const [name, setName] = useState('');
    const [relationStatus, setRelationStatus] = useState('Prospect');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await airtableService.createProject({
                name,
                relationStatus,
                notes,
                status: 'Active'
            });
            setName('');
            setNotes('');
            setRelationStatus('Prospect');
            onProjectCreated();
            onClose();
        } catch (error) {
            console.error('Failed to create project:', error);
            alert('Failed to create project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassModal isOpen={isOpen} onClose={onClose} title="New Project">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>
                        Project / Client Name
                    </label>
                    <GlassInput
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Downtown Gym"
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>
                        Relation Status
                    </label>
                    <select
                        value={relationStatus}
                        onChange={(e) => setRelationStatus(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--color-border-glass)',
                            borderRadius: '12px',
                            padding: '12px',
                            color: 'var(--color-text-main)',
                            fontSize: '1rem',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="Prospect">Prospect</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Active Client">Active Client</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>
                        Initial Notes
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Quick notes or description..."
                        style={{
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--color-border-glass)',
                            borderRadius: '12px',
                            padding: '12px',
                            color: 'var(--color-text-main)',
                            fontSize: '1rem',
                            outline: 'none',
                            minHeight: '100px',
                            resize: 'vertical',
                            fontFamily: 'var(--font-main)'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Cancel
                    </button>
                    <GlassButton type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Project'}
                    </GlassButton>
                </div>
            </form>
        </GlassModal>
    );
};

export default CreateProjectModal;
