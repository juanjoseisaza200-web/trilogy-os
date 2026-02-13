import Airtable from 'airtable';

const base = new Airtable({ apiKey: import.meta.env.VITE_AIRTABLE_API_KEY }).base(
    import.meta.env.VITE_AIRTABLE_BASE_ID
);

// Helper to safely convert any Airtable value to a string for display
const ensureString = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (Array.isArray(value)) {
        return value.map(item => ensureString(item)).join(', ');
    }
    if (typeof value === 'object') {
        return value.name || value.label || value.id || JSON.stringify(value);
    }
    return String(value);
};

const fetchMeetings = async () => {
    try {
        const records = await base('Meet Logs').select({
            sort: [{ field: 'Date', direction: 'desc' }]
        }).all();

        return records.map(record => ({
            id: record.id,
            title: ensureString(record.get('Title')),
            date: ensureString(record.get('Date')),
            notes: ensureString(record.get('Notes')),
            // Handle both spellings and ensure string
            attendees: ensureString(record.get('Atendees') || record.get('Attendees')),
            creator: record.get('Creator'),
            attachments: record.get('Images') || []
        }));
    } catch (error) {
        console.error('Error fetching meetings:', error);
        return [];
    }
};

const createMeeting = async (meetingData) => {
    try {
        const records = await base('Meet Logs').create([
            {
                fields: {
                    Title: meetingData.title,
                    Date: meetingData.date,
                    Notes: meetingData.notes,
                    Creator: meetingData.creator,
                    // Use the specific spelling "Atendees"
                    Atendees: Array.isArray(meetingData.attendees) ? meetingData.attendees : [meetingData.attendees]
                }
            }
        ], { typecast: true }); // Enable typecast to allow creating new select options/collaborators
        return records[0];
    } catch (error) {
        console.error('Error creating meeting:', error);
        throw error;
    }
};

const updateMeeting = async (id, meetingData) => {
    try {
        const records = await base('Meet Logs').update([
            {
                id: id,
                fields: {
                    Title: meetingData.title,
                    Date: meetingData.date,
                    Notes: meetingData.notes,
                    Atendees: Array.isArray(meetingData.attendees) ? meetingData.attendees : [meetingData.attendees]
                }
            }
        ], { typecast: true });
        return records[0];
    } catch (error) {
        console.error('Error updating meeting:', error);
        throw error;
    }
};

const fetchTasks = async () => {
    try {
        const records = await base('Tasks').select().all();
        console.log('Raw Task Records:', records.map(r => r.fields)); // Debug log

        return records.map(record => ({
            id: record.id,
            title: record.get('Title'),
            status: record.get('Status') || 'To Do',
            assignee: record.get('Assignee'),
            creator: record.get('Creator'),
            dueDate: record.get('DueDate'),
            project: record.get('Project') ? ensureString(record.get('Project')[0]) : null, // Get first project name if linked
            projectId: record.get('Project') ? record.get('Project')[0] : null // Keep ID for linking
        }));
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
};

const updateTaskStatus = async (id, newStatus) => {
    try {
        await base('Tasks').update([
            {
                id: id,
                fields: {
                    Status: newStatus
                }
            }
        ], { typecast: true });
        return true;
    } catch (error) {
        console.error('Error updating task:', error);
        return false;
    }
};

const createTask = async (taskData) => {
    try {
        const records = await base('Tasks').create([
            {
                fields: {
                    Title: taskData.title,
                    Status: taskData.status || 'To Do',
                    Assignee: taskData.assignee,
                    Creator: taskData.creator,
                    DueDate: taskData.dueDate
                }
            }
        ], { typecast: true });
        return records[0];
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};

const deleteMeeting = async (id) => {
    try {
        await base('Meet Logs').destroy(id);
        return true;
    } catch (error) {
        console.error('Error deleting meeting:', error);
        throw error;
    }
};

const deleteTask = async (id) => {
    try {
        await base('Tasks').destroy(id);
        return true;
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};

const fetchUserByName = async (name) => {
    try {
        const records = await base('Users').select({
            filterByFormula: `{Name} = '${name}'`,
            maxRecords: 1
        }).firstPage();

        if (records.length > 0) {
            const record = records[0];
            return {
                id: record.id,
                name: record.get('Name'),
                role: record.get('Role')
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null; // Fail gracefully
    }
};

const createUser = async (name, role = '') => {
    try {
        const records = await base('Users').create([
            {
                fields: {
                    Name: name,
                    Role: role
                }
            }
        ]);
        const record = records[0];
        return {
            id: record.id,
            name: record.get('Name'),
            role: record.get('Role')
        };
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

const updateUserRole = async (id, role) => {
    try {
        await base('Users').update([
            {
                id: id,
                fields: {
                    Role: role
                }
            }
        ]);
        return true;
    } catch (error) {
        console.error('Error updating user role:', error);
        return false;
    }
};

export default {
    fetchMeetings,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    fetchTasks,
    updateTaskStatus,
    createTask,
    deleteTask,
    deleteTasks: async (ids) => {
        try {
            // Airtable API allows deleting up to 10 records per request
            const chunks = [];
            for (let i = 0; i < ids.length; i += 10) {
                chunks.push(ids.slice(i, i + 10));
            }

            for (const chunk of chunks) {
                await base('Tasks').destroy(chunk);
            }
            return true;
        } catch (error) {
            console.error('Error deleting tasks batch:', error);
            throw error;
        }
    },
    fetchUserByName,
    createUser,
    updateUserRole,

    // Projects
    fetchProjects: async () => {
        try {
            const records = await base('Projects').select({
                sort: [{ field: 'Name', direction: 'asc' }]
            }).all();

            return records.map(record => ({
                id: record.id,
                name: ensureString(record.get('Name')),
                status: record.get('Status') || 'Active',
                relationStatus: record.get('RelationStatus') || 'Prospect',
                notes: ensureString(record.get('Notes')),
                taskIds: record.get('Tasks') || [] // Array of linked task IDs
            }));
        } catch (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
    },

    createProject: async (projectData) => {
        try {
            const records = await base('Projects').create([
                {
                    fields: {
                        Name: projectData.name,
                        Status: projectData.status || 'Active',
                        RelationStatus: projectData.relationStatus || 'Prospect',
                        Notes: projectData.notes || ''
                    }
                }
            ], { typecast: true });
            return records[0];
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    },

    updateProject: async (id, projectData) => {
        try {
            const fields = {};
            if (projectData.name !== undefined) fields.Name = projectData.name;
            if (projectData.status !== undefined) fields.Status = projectData.status;
            if (projectData.relationStatus !== undefined) fields.RelationStatus = projectData.relationStatus;
            if (projectData.notes !== undefined) fields.Notes = projectData.notes;

            const records = await base('Projects').update([
                { id, fields }
            ], { typecast: true });
            return records[0];
        } catch (error) {
            console.error('Error updating project:', error);
            throw error;
        }
    },

    deleteProject: async (id) => {
        try {
            await base('Projects').destroy(id);
            return true;
        } catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    }
};
