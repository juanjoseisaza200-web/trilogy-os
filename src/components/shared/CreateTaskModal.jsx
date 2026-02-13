import React, { useState, useEffect } from 'react';
import GlassModal from './GlassModal';
import GlassInput from './GlassInput';
import GlassButton from './GlassButton';
import airtableService from '../../services/airtable';
import { useAuth } from '../../contexts/AuthContext';

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated, initialData = {}, initialProject, initialProjectName }) => {
    const { user } = useAuth();

    // State Definitions
    const [title, setTitle] = useState('');
    const [assignee, setAssignee] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('To Do');
    const [project, setProject] = useState(''); // Project ID

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    // Data Loading
    useEffect(() => {
        if (isOpen) {
            // Apply initial data if present (e.g. for editing, though this modal is mostly for creation)
            if (initialData.title) setTitle(initialData.title);
            if (initialData.assignee) setAssignee(initialData.assignee);
            if (initialData.dueDate) setDueDate(initialData.dueDate);
            if (initialData.status) setStatus(initialData.status);

            // Set Project from prop if provided
            if (initialProject) {
                setProject(initialProject);
            } else {
                setProject('');
            }

            // Load available projects for the dropdown
            const loadProjects = async () => {
                try {
                    const data = await airtableService.fetchProjects();
                    setProjects(data);
                } catch (error) {
                    console.error('Failed to load projects:', error);
                }
            };
            loadProjects();
        } else {
            // Reset on close (optional but good for cleanup)
            if (!initialData.title) setTitle('');
            if (!initialProject) setProject('');
        }
    }, [isOpen, initialData, initialProject]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await airtableService.createTask({
                title,
                status,
                assignee,
                dueDate,
                project: project ? [project] : undefined, // Link to project if selected
                creator: user // Add creator info
            });

            // Reset Form
            setTitle('');
            setStatus('To Do');
            setAssignee('');
            setDueDate('');
            setProject('');

            onTaskCreated();
            onClose();
        } catch (error) {
            console.error('Create task failed:', error);
            alert(`Failed to create task: ${error.message || error}`);
        } finally {
            setLoading(false);
        }
    };

    // User selection helper (hardcoded for now, same as before)
    const availableUsers = ['Tomás', 'Juan José'];

    const toggleAssignee = (name) => {
        const current = assignee.split(',').map(s => s.trim()).filter(s => s);
        const newSelection = current.includes(name)
            ? current.filter(n => n !== name)
            : [...current, name];
        setAssignee(newSelection.join(', '));
    };

    return (
        <GlassModal isOpen={isOpen} onClose={onClose} title="New Task">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>
                        Task Title
                    </label>
                    <GlassInput
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Design Homepage"
                        required
                        autoFocus
                    />
                </div>

                {/* Project Selector */}
                <div>
                    <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>
                        Project (Optional)
                    </label>
                    <select
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
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
                        <option value="">No Project</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>
                        Assignee
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                        {availableUsers.map(name => (
                            <button
                                key={name}
                                type="button"
                                onClick={() => toggleAssignee(name)}
                                style={{
                                    background: assignee.includes(name) ? 'var(--color-gold-primary)' : 'rgba(255, 255, 255, 0.05)',
                                    color: assignee.includes(name) ? '#000' : 'var(--color-text-main)',
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
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                        placeholder="Type to add others..."
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>
                            Due Date
                        </label>
                        <GlassInput
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
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
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>
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
                        {loading ? 'Creating...' : 'Create Task'}
                    </GlassButton>
                </div>
            </form>
        </GlassModal>
    );
};

export default CreateTaskModal;
