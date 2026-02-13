import React, { useState, useEffect } from 'react';
import GlassCard from '../components/shared/GlassCard';
import GlassButton from '../components/shared/GlassButton';
import { Plus, Folder, Clock, MoreHorizontal, ArrowRight } from 'lucide-react';
import airtableService from '../services/airtable';
import { useNavigate } from 'react-router-dom';
import CreateProjectModal from '../components/shared/CreateProjectModal'; // We'll need this

const ProjectHub = () => {
    // State for delete confirmation
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, id: null, name: '' });

    const handleDeleteClick = (e, project) => {
        e.stopPropagation(); // Prevent navigation
        setDeleteConfirmation({ isOpen: true, id: project.id, name: project.name });
    };

    const confirmDelete = async () => {
        if (!deleteConfirmation.id) return;
        try {
            await airtableService.deleteProject(deleteConfirmation.id);
            setProjects(projects.filter(p => p.id !== deleteConfirmation.id));
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project');
        }
        setDeleteConfirmation({ isOpen: false, id: null, name: '' });
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px'
            }}>
                <div>
                    <h1 style={{ color: 'var(--color-gold-primary)', margin: 0 }}>Projects</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>Manage clients and initiatives.</p>
                </div>
                <GlassButton
                    variant="primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <Plus size={18} />
                    New Project
                </GlassButton>
            </div>

            {loading ? (
                <div style={{ color: 'var(--color-text-muted)' }}>Loading projects...</div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '24px'
                }}>
                    {projects.map(project => (
                        <GlassCard
                            key={project.id}
                            style={{
                                padding: '24px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '200px', // Fixed height for consistent grid
                                justifyContent: 'space-between',
                                position: 'relative'
                            }}
                            onClick={() => navigate(`/projects/${project.id}`)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {/* Delete Button (Hover only usually, but visible for now for simplicity) */}
                            <button
                                onClick={(e) => handleDeleteClick(e, project)}
                                style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--color-text-muted)',
                                    cursor: 'pointer',
                                    zIndex: 10,
                                    padding: '4px'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#ff4d4d'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                                title="Delete Project"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                    <div style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        padding: '8px',
                                        borderRadius: '8px',
                                        color: 'var(--color-gold-primary)'
                                    }}>
                                        <Folder size={24} />
                                    </div>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: getRelationColor(project.relationStatus),
                                        border: `1px solid ${getRelationColor(project.relationStatus)}`,
                                        fontWeight: 'bold'
                                    }}>
                                        {project.relationStatus}
                                    </span>
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>{project.name}</h3>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                <div style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--color-text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <Clock size={14} />
                                    <span>{project.status}</span>
                                </div>
                                <div style={{ color: 'var(--color-gold-primary)' }}>
                                    <ArrowRight size={20} />
                                </div>
                            </div>
                        </GlassCard>
                    ))}

                    {projects.length === 0 && (
                        <div style={{
                            gridColumn: '1 / -1',
                            textAlign: 'center',
                            padding: '48px',
                            color: 'var(--color-text-muted)',
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '16px',
                            border: '1px dashed var(--color-border-glass)'
                        }}>
                            <Folder size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
                            <h3>No projects yet</h3>
                            <p>Create your first project to get started.</p>
                        </div>
                    )}
                </div>
            )}

            <CreateProjectModal
                isOpen={iscreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onProjectCreated={handleProjectCreated}
            />

            {/* Confirmation Modal for Delete */}
            {deleteConfirmation.isOpen && (
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
                            Are you sure you want to delete <strong>{deleteConfirmation.name}</strong>? This cannot be undone.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button
                                onClick={() => setDeleteConfirmation({ isOpen: false, id: null, name: '' })}
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
        </div>
    );
};

export default ProjectHub;
