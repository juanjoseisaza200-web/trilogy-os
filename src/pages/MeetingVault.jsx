import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import GlassCard from '../components/shared/GlassCard';
import GlassInput from '../components/shared/GlassInput';
import GlassModal from '../components/shared/GlassModal';
import GlassButton from '../components/shared/GlassButton';
import ConfirmationModal from '../components/shared/ConfirmationModal';
import airtableService from '../services/airtable';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Plus, Trash2 } from 'lucide-react';

const MeetingVault = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMeetingId, setSelectedMeetingId] = useState(null); // Track ID for editing
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, id: null });


    const [formData, setFormData] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        attendees: ''
    });

    useEffect(() => {
        loadMeetings();
    }, []);

    // Check for URL param to open specific meeting
    useEffect(() => {
        const openId = searchParams.get('id');
        if (openId && meetings.length > 0) {
            const meetingToOpen = meetings.find(m => m.id === openId);
            if (meetingToOpen) {
                handleEditClick(meetingToOpen);
            }
        }
    }, [searchParams, meetings]);

    const handleDelete = (e, id) => {
        e.stopPropagation();
        setDeleteConfirmation({ isOpen: true, id });
    };

    const confirmDelete = async () => {
        if (!deleteConfirmation.id) return;
        try {
            await airtableService.deleteMeeting(deleteConfirmation.id);
            loadMeetings();
        } catch (error) {
            console.error('Delete failed:', error);
            alert(`Failed to delete meeting: ${error.message || error}`);
        }
        setDeleteConfirmation({ isOpen: false, id: null });
    };

    const loadMeetings = async () => {
        try {
            console.log('Fetching meetings...');
            const data = await airtableService.fetchMeetings();
            console.log('Meetings fetched:', data);
            setMeetings(data);
        } catch (error) {
            console.error('Failed to load meetings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdateMeeting = async (e) => {
        e.preventDefault();
        try {
            const meetingData = {
                ...formData,
                creator: user, // Add creator
                // Split by comma or slash, trim whitespace, and filter out empty strings
                attendees: formData.attendees.split(/[,/]/).map(s => s.trim()).filter(s => s)
            };

            if (selectedMeetingId) {
                await airtableService.updateMeeting(selectedMeetingId, meetingData);
            } else {
                await airtableService.createMeeting(meetingData);
            }

            setIsModalOpen(false);
            resetForm();
            loadMeetings(); // Refresh list
        } catch (error) {
            console.error(error);
            alert(`Failed to save meeting: ${error.message || 'Unknown error'}`);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            date: new Date().toISOString().split('T')[0],
            notes: '',
            attendees: ''
        });
        setSelectedMeetingId(null);
    };

    const handleEditClick = (meeting) => {
        setFormData({
            title: meeting.title,
            date: meeting.date,
            notes: meeting.notes,
            // Ensure attendees is a string for the input/logic
            attendees: Array.isArray(meeting.attendees) ? meeting.attendees.join(', ') : meeting.attendees
        });
        setSelectedMeetingId(meeting.id);
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ color: 'var(--color-gold-primary)', margin: 0 }}>Meeting Vault</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>Archive of team reunions and decisions.</p>
                </div>
                <GlassButton
                    variant="primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                >
                    <Plus size={18} />
                    Log Meeting
                </GlassButton>
            </div>

            {loading ? (
                <div style={{ color: 'var(--color-text-muted)' }}>Loading records...</div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '24px'
                }}>
                    {meetings.map((meeting) => (
                        <div key={meeting.id} style={{ position: 'relative' }}>
                            <div onClick={() => handleEditClick(meeting)} style={{ cursor: 'pointer' }}>
                                <GlassCard className="meeting-card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--color-gold-primary)' }}>
                                        <Calendar size={16} />
                                        <span style={{ fontSize: '0.9rem' }}>{meeting.date}</span>
                                    </div>
                                    <h3 style={{ margin: '0 0 12px 0', fontSize: '1.25rem' }}>{meeting.title}</h3>
                                    <div style={{
                                        color: 'var(--color-text-muted)',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.5',
                                        maxHeight: '4.5em', // approx 3 lines
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        marginBottom: '8px',
                                        position: 'relative'
                                    }}>
                                        {meeting.notes}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-gold-primary)', fontStyle: 'italic', opacity: 0.8 }}>
                                        Click to view full notes...
                                    </div>
                                    {meeting.attendees && (
                                        <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                            Attendees: {meeting.attendees}
                                        </div>
                                    )}

                                    {meeting.creator && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '12px',
                                            right: '12px',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: 'var(--color-gold-primary)',
                                            color: '#000',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            title: `Created by ${meeting.creator}`
                                        }}>
                                            {meeting.creator.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </GlassCard>
                            </div>
                            <button
                                onClick={(e) => handleDelete(e, meeting.id)}
                                style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--color-text-muted)',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    zIndex: 10,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#ff4d4d'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmationModal
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, id: null })}
                onConfirm={confirmDelete}
                title="Delete Meeting Log"
                message="Are you sure you want to delete this meeting? This action cannot be undone."
                confirmText="Delete Log"
                confirmVariant="danger"
            />

            <GlassModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedMeetingId ? "Edit Meeting" : "Log New Meeting"}
            >
                <form onSubmit={handleCreateOrUpdateMeeting} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Title</label>
                        <GlassInput
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Weekly Sync"
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Date</label>
                        <GlassInput
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Attendees</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                            {['Tomás', 'Juan José'].map(name => (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => {
                                        const current = formData.attendees.split(',').map(s => s.trim()).filter(s => s);
                                        const newSelection = current.includes(name)
                                            ? current.filter(n => n !== name)
                                            : [...current, name];
                                        setFormData({ ...formData, attendees: newSelection.join(', ') });
                                    }}
                                    style={{
                                        background: formData.attendees.includes(name) ? 'var(--color-gold-primary)' : 'rgba(255, 255, 255, 0.05)',
                                        color: formData.attendees.includes(name) ? '#000' : 'var(--color-text-main)',
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
                            name="attendees"
                            value={formData.attendees}
                            onChange={handleChange}
                            placeholder="Type to add others (e.g. Mike, Sarah)"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={4}
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
                                resize: 'vertical',
                                outline: 'none'
                            }}
                            placeholder="Key decisions and action items..."
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                        <GlassButton type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </GlassButton>
                        <GlassButton type="submit" variant="primary">
                            {selectedMeetingId ? "Update Log" : "Save Log"}
                        </GlassButton>
                    </div>
                </form>
            </GlassModal>
        </div>
    );
};

export default MeetingVault;
