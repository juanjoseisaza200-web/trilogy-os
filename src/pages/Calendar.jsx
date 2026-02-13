import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import GlassCard from '../components/shared/GlassCard';
import GlassButton from '../components/shared/GlassButton';
import GlassModal from '../components/shared/GlassModal';
import GlassInput from '../components/shared/GlassInput';
import airtableService from '../services/airtable';
import { useAuth } from '../contexts/AuthContext';

const Calendar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [title, setTitle] = useState('');

    useEffect(() => {
        loadMeetings();
    }, []);

    const loadMeetings = async () => {
        try {
            const data = await airtableService.fetchMeetings();
            setMeetings(data);
        } catch (error) {
            console.error('Failed to load meetings:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentDate);

    const changeMonth = (offset) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const handleDayClick = (day) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setSelectedDate(dateStr);
        setTitle('');
        setIsModalOpen(true);
    };

    const handleSchedule = async (e) => {
        e.preventDefault();
        try {
            await airtableService.createMeeting({
                title,
                date: selectedDate,
                notes: '',
                attendees: [],
                creator: user
            });
            setIsModalOpen(false);
            loadMeetings();
            // Optional: Navigate to vault to edit immediately
            // navigate(`/meetings?id=${newMeeting.id}`);
        } catch (error) {
            alert('Failed to schedule meeting');
        }
    };

    const renderCalendar = () => {
        const blanks = Array(firstDay).fill(null);
        const daySlots = Array.from({ length: days }, (_, i) => i + 1);
        const allSlots = [...blanks, ...daySlots];

        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '8px',
                marginTop: '16px'
            }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} style={{
                        textAlign: 'center',
                        color: 'var(--color-text-muted)',
                        fontSize: '0.8rem',
                        padding: '8px'
                    }}>
                        {day}
                    </div>
                ))}

                {allSlots.map((day, index) => {
                    if (!day) return <div key={`blank-${index}`} />;

                    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayMeetings = meetings.filter(m => m.date === dateStr);
                    const isToday = new Date().toISOString().split('T')[0] === dateStr;

                    return (
                        <div
                            key={day}
                            onClick={() => handleDayClick(day)}
                            style={{
                                height: '100px',
                                background: isToday ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                                border: isToday ? '1px solid var(--color-gold-primary)' : '1px solid var(--color-border-glass)',
                                borderRadius: '8px',
                                padding: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                overflow: 'hidden'
                            }}
                            className="calendar-day"
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '4px',
                                fontSize: '0.9rem',
                                color: isToday ? 'var(--color-gold-primary)' : 'inherit'
                            }}>
                                {day}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {dayMeetings.map(m => (
                                    <div
                                        key={m.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/meetings?id=${m.id}`);
                                        }}
                                        style={{
                                            fontSize: '0.75rem',
                                            background: 'var(--color-gold-primary)',
                                            color: '#000',
                                            padding: '2px 4px',
                                            borderRadius: '4px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                        title={m.title}
                                    >
                                        {m.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <h1 style={{ margin: 0, color: 'var(--color-gold-primary)' }}>Calendar</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px' }}>
                        <button onClick={() => changeMonth(-1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                            <ChevronLeft size={20} />
                        </button>
                        <span style={{ minWidth: '120px', textAlign: 'center', fontWeight: 'bold' }}>
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={() => changeMonth(1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <GlassCard>
                {renderCalendar()}
            </GlassCard>

            <GlassModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Schedule Meeting"
            >
                <form onSubmit={handleSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Date</label>
                        <GlassInput value={selectedDate} readOnly />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Title</label>
                        <GlassInput
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Client Strategy Call"
                            required
                            autoFocus
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                        <GlassButton type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</GlassButton>
                        <GlassButton type="submit" variant="primary">Schedule</GlassButton>
                    </div>
                </form>
            </GlassModal>
        </div>
    );
};

export default Calendar;
