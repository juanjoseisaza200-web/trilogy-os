import React, { useState, useEffect } from 'react';
import GlassModal from './GlassModal';
import GlassInput from './GlassInput';
import GlassButton from './GlassButton';
import airtableService from '../../services/airtable';
import { useAuth } from '../../contexts/AuthContext';

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated, initialData = {} }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        assignee: '',
        dueDate: '',
        status: 'To Do',
        ...initialData
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                title: '',
                assignee: '',
                dueDate: '',
                status: 'To Do',
                ...initialData
            });
        }
        // Only run when modal opens, ignore initialData changes to prevent reset loops
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            if (formData.title.trim()) {
                await airtableService.createTask({
                    ...formData,
                    creator: user // Add creator
                });
                onTaskCreated(); // Callback to refresh parent
                onClose();
            }
        } catch (error) {
            console.error('Create task failed:', error);
            alert(`Failed to create task: ${error.message || error}`);
        }
    };

    return (
        <GlassModal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Task"
        >
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Task Title</label>
                    <GlassInput
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Design Homepage"
                        required
                        autoFocus
                    />
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Assignee</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                        {['Tomás', 'Juan José'].map(name => (
                            <button
                                key={name}
                                type="button"
                                onClick={() => {
                                    const current = formData.assignee.split(',').map(s => s.trim()).filter(s => s);
                                    const newSelection = current.includes(name)
                                        ? current.filter(n => n !== name)
                                        : [...current, name];
                                    setFormData({ ...formData, assignee: newSelection.join(', ') });
                                }}
                                style={{
                                    background: formData.assignee.includes(name) ? 'var(--color-gold-primary)' : 'rgba(255, 255, 255, 0.05)',
                                    color: formData.assignee.includes(name) ? '#000' : 'var(--color-text-main)',
                                    border: '1px solid var(--color-border-glass)',
                                    borderRadius: '20px',
                                    padding: '6px 12px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                    <GlassInput
                        name="assignee"
                        value={formData.assignee}
                        onChange={handleChange}
                        placeholder="Type to add others..."
                    />
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Due Date</label>
                    <GlassInput
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--color-border-glass)',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            color: 'var(--color-text-main)',
                            fontFamily: 'var(--font-main)',
                            fontSize: '1rem',
                            width: '100%',
                            boxSizing: 'border-box',
                            outline: 'none'
                        }}
                    >
                        <option value="To Do" style={{ color: 'black' }}>To Do</option>
                        <option value="In Progress" style={{ color: 'black' }}>In Progress</option>
                        <option value="Done" style={{ color: 'black' }}>Done</option>
                    </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                    <GlassButton type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </GlassButton>
                    <GlassButton type="submit" variant="primary">
                        Create Task
                    </GlassButton>
                </div>
            </form>
        </GlassModal>
    );
};

export default CreateTaskModal;
