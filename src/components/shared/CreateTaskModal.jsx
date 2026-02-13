import React, { useState, useEffect } from 'react';
import GlassModal from './GlassModal';
import GlassInput from './GlassInput';
import GlassButton from './GlassButton';
import airtableService from '../../services/airtable';
import { useAuth } from '../../contexts/AuthContext';

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated, initialData = {}, initialProject, initialProjectName }) => {
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
            // Load projects
            const loadProjects = async () => {
                const data = await airtableService.fetchProjects();
                setProjects(data);
                // Pre-select if initialProject provided
                if (initialProject) {
                    setProject(initialProject); // Note: We need the ID here for linking
                }
            };
            loadProjects();
        }
    }, [isOpen, initialProject]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // We need to pass the project ID (array of IDs for Link field) to Airtable
            // If project is selected, pass [project]
            const taskData = {
                title,
                status,
                assignee,
                dueDate
            };

            // Add Project link if selected
            // Note: airtable.js createTask might need update to handle 'Project' field mapping to ID array
            // Let's check airtable.js... it maps 'Project' in fetchTasks but createTask maps fields manually.
            // I need to update airtable.js createTask to accept 'Project' field.
            // Wait, I can pass it here if I update the service call below.

            // Actually, let's update the service to handle "project" property in the object passed to it.
            await airtableService.createTask({
                ...taskData,
                project: project ? [project] : undefined // Pass as array for Link field
            });

            setTitle('');
            setStatus('To Do');
            setAssignee('');
            setDueDate('');
            setProject('');
            onTaskCreated();
            onClose();
        } catch (error) {
            // ... error handling
            console.error(error);
            alert('Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassModal isOpen={isOpen} onClose={onClose} title="New Task">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* ... existing fields ... */}
                <div>
                    <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>
                        Title
                    </label>
                    <GlassInput
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Task title..."
                        required
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
