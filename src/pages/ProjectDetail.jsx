import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import airtableService from '../services/airtable';
import GlassCard from '../components/shared/GlassCard';
import GlassButton from '../components/shared/GlassButton';
import GlassEditor from '../components/shared/GlassEditor';
import { ArrowLeft, Plus, Save, Trash2, CheckCircle, Circle, Clock } from 'lucide-react';
import CreateTaskModal from '../components/shared/CreateTaskModal';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]); // Filtered tasks for this project
    const [loading, setLoading] = useState(true);
    const [savingNotes, setSavingNotes] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        // Load all projects and find this one (since we don't have a fetchProjectById yet, fetching all is okay for V1)
        // Optimization: In V2, add fetchProjectById to service
        const allProjects = await airtableService.fetchProjects();
        const currentProject = allProjects.find(p => p.id === id);

        if (currentProject) {
            setProject(currentProject);

            // Load all tasks and filter
            // Optimization: In V2, filter in Airtable API
            const allTasks = await airtableService.fetchTasks();
            const projectTasks = allTasks.filter(t => t.projectId === id || (t.project && t.project === currentProject.name));
            setTasks(projectTasks);
        }
        setLoading(false);
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSaveNotes = async () => {
        if (!project) return;
        setSavingNotes(true);
        try {
            await airtableService.updateProject(project.id, { notes: project.notes });
        } catch (error) {
            console.error('Error saving notes:', error);
            alert('Failed to save notes');
        }
        setSavingNotes(false);
    };

    const handleStatusChange = async (newStatus) => {
        // Optimistic update
        setProject(prev => ({ ...prev, relationStatus: newStatus }));
        try {
            await airtableService.updateProject(project.id, { relationStatus: newStatus });
        } catch (error) {
            console.error('Error updating status:', error);
            loadData(); // Revert
        }
    };

    const handleTaskCreated = () => {
        loadData();
    };

    // Relation Status Badge Colors (Duplicated from Hub, could be a shared util)
    const getRelationColor = (status) => {
        switch (status) {
            case 'Active Client': return 'var(--color-gold-primary)';
            case 'Negotiation': return '#f59e0b';
            case 'Prospect': return '#3b82f6';
            case 'On Hold': return '#ef4444';
            case 'Completed': return '#10b981';
            default: return 'var(--color-text-muted)';
        }
    };

    const [deleteConfirmation, setDeleteConfirmation] = useState(false);

    const handleDeleteClick = () => {
        setDeleteConfirmation(true);
    };

    const confirmDelete = async () => {
        if (!project) return;
        try {
            await airtableService.deleteProject(project.id);
            navigate('/projects');
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project');
        }
    };

    if (loading) return <div style={{ padding: '24px', color: 'var(--color-text-muted)' }}>Loading project...</div>;
    if (!project) return <div style={{ padding: '24px', color: 'var(--color-text-muted)' }}>Project not found</div>;

    return (
        <div style={{ height: 'calc(100vh - 20px)', display: 'flex', flexDirection: 'column', padding: '24px', gap: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={() => navigate('/projects')}
                        style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 style={{ margin: 0, color: 'var(--color-gold-primary)' }}>{project.name}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                            <select
                                value={project.relationStatus}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: `1px solid ${getRelationColor(project.relationStatus)}`,
                                    borderRadius: '8px',
                                    color: getRelationColor(project.relationStatus),
                                    padding: '4px 8px',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
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
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                                {project.status}
                            </span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <GlassButton
                        variant="secondary"
                        onClick={handleDeleteClick}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4d4d', borderColor: 'rgba(255, 77, 77, 0.3)' }}
                    >
                        <Trash2 size={16} />
                        Delete
                    </GlassButton>
                    <GlassButton
                        onClick={handleSaveNotes}
                        disabled={savingNotes}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: savingNotes ? 0.7 : 1 }}
                    >
                        <Save size={16} />
                        {savingNotes ? 'Saving...' : 'Save Notes'}
                    </GlassButton>
                </div>
            </div>

            {/* Confirmation Modal for Delete */}
            {deleteConfirmation && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'rgba(20, 20, 20, 0.95)',
                        border: '1px solid var(--color-border-glass)',
                        borderRadius: '16px',
                        padding: '24px',
                        maxWidth: '400px',
                        width: '90%',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <h3 style={{ color: '#ff4d4d', marginTop: 0 }}>Delete Project?</h3>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                            Are you sure you want to delete <strong>{project.name}</strong>? This cannot be undone.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button
                                onClick={() => setDeleteConfirmation(false)}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid var(--color-border-glass)',
                                    color: 'var(--color-text-main)',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                style={{
                                    background: 'rgba(255, 77, 77, 0.2)',
                                    border: '1px solid #ff4d4d',
                                    color: '#ff4d4d',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Split Layout */}
            <div style={{ display: 'flex', flex: 1, gap: '24px', overflow: 'hidden', flexDirection: window.innerWidth <= 768 ? 'column' : 'row' }}>

                {/* Left Panel: Context (Notes) */}
                <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border-glass)', background: 'rgba(0,0,0,0.2)' }}>
                        <h3 style={{ margin: 0, color: 'var(--color-text-main)' }}>Context & Notes</h3>
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <GlassEditor
                            value={project.notes}
                            onChange={(e) => setProject(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Type important things to have in mind..."
                            style={{ border: 'none', borderRadius: '0', background: 'transparent', flex: 1 }}
                        />
                    </div>
                </GlassCard>

                {/* Right Panel: Execution (Tasks) */}
                <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0', maxWidth: window.innerWidth > 768 ? '450px' : '100%' }}>
                    <div style={{
                        padding: '16px',
                        borderBottom: '1px solid var(--color-border-glass)',
                        background: 'rgba(0,0,0,0.2)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{ margin: 0, color: 'var(--color-text-main)' }}>Tasks</h3>
                        <GlassButton
                            variant="secondary"
                            style={{ padding: '4px 8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => setIsTaskModalOpen(true)}
                        >
                            <Plus size={14} /> Add
                        </GlassButton>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {tasks.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '20px' }}>
                                No tasks linked yet.
                            </div>
                        ) : (
                            tasks.map(task => (
                                <div key={task.id} style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--color-border-glass)',
                                    display: 'flex',
                                    alignItems: 'start',
                                    gap: '12px'
                                }}>
                                    <div style={{
                                        color: task.status === 'Done' ? '#10b981' : task.status === 'In Progress' ? 'var(--color-gold-primary)' : 'var(--color-text-muted)',
                                        marginTop: '2px'
                                    }}>
                                        {task.status === 'Done' ? <CheckCircle size={16} /> : <Circle size={16} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: task.status === 'Done' ? 'var(--color-text-muted)' : 'var(--color-text-main)', textDecoration: task.status === 'Done' ? 'line-through' : 'none' }}>
                                            {task.title}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                            {task.assignee && <span>{task.assignee}</span>}
                                            {task.dueDate && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                    <Clock size={10} /> {task.dueDate}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{
                                        fontSize: '0.7rem',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        background: 'rgba(255,255,255,0.1)',
                                        color: 'var(--color-text-muted)'
                                    }}>
                                        {task.status}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* We need to pass the project name/id to the CreateTaskModal to auto-link it, 
                but CreateTaskModal currently doesn't support 'project' prop.
                We might need to update CreateTaskModal or just let the user select it manually for V1.
                Or... we can modify CreateTaskModal right now to accept 'initialProject'.
            */}
            <CreateTaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onTaskCreated={handleTaskCreated}
                initialProject={project.id}
            />
        </div>
    );
};

export default ProjectDetail;
