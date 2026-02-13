import React, { useState, useEffect } from 'react';
import GlassCard from '../components/shared/GlassCard';
import GlassButton from '../components/shared/GlassButton';
import { Plus, Folder, Clock, MoreHorizontal, ArrowRight } from 'lucide-react';
import airtableService from '../services/airtable';
import { useNavigate } from 'react-router-dom';
import CreateProjectModal from '../components/shared/CreateProjectModal'; // We'll need this

const ProjectHub = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [iscreateModalOpen, setIsCreateModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        const data = await airtableService.fetchProjects();
        setProjects(data);
        setLoading(false);
    };

    const handleProjectCreated = () => {
        loadProjects();
    };

    // Relation Status Badge Colors
    const getRelationColor = (status) => {
        switch (status) {
            case 'Active Client': return 'var(--color-gold-primary)'; // Gold/Greenish
            case 'Negotiation': return '#f59e0b'; // Orange
            case 'Prospect': return '#3b82f6'; // Blue
            case 'On Hold': return '#ef4444'; // Red
            case 'Completed': return '#10b981'; // Green
            default: return 'var(--color-text-muted)';
        }
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
                                justifyContent: 'space-between'
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

            {/* We will create the CreateProjectModal next */}
            {iscreateModalOpen && (
                <CreateProjectModal
                    isOpen={iscreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onProjectCreated={handleProjectCreated}
                />
            )}
        </div>
    );
};

export default ProjectHub;
