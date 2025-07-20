import React, { useState, useEffect } from 'react';
import { listByUser, create, update, remove } from '../lib/api-education.js';
import auth from '../lib/auth-helper.js';
import { 
    Button, 
    TextField, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions,
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Fab,
    IconButton
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

export default function Services() {
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedEducation, setSelectedEducation] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        firstname: '',
        lastname: '',
        email: '',
        completion: '',
        description: ''
    });

    const loadEducations = async () => {
        const jwt = auth.isAuthenticated();
        if (jwt && jwt.token) {
            setLoading(true);
            setError('');

            try {
                const data = await listByUser();
                if (data?.error) {
                    setError(data.error);
                } else {
                    setEducations(data || []);
                }
            } catch (err) {
                console.error('Error loading educations:', err);
                setError('Failed to load education data');
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
            setEducations([]);
        }
    };

    useEffect(() => {
        loadEducations();
    }, []);

    const handleOpen = (education = null) => {
        if (education) {
            setEditMode(true);
            setSelectedEducation(education);
            setFormData({
                title: education.title,
                firstname: education.firstname,
                lastname: education.lastname,
                email: education.email,
                completion: education.completion.split('T')[0],
                description: education.description
            });
        } else {
            setEditMode(false);
            setSelectedEducation(null);
            setFormData({
                title: '',
                firstname: '',
                lastname: '',
                email: '',
                completion: '',
                description: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditMode(false);
        setSelectedEducation(null);
        setFormData({
            title: '',
            firstname: '',
            lastname: '',
            email: '',
            completion: '',
            description: ''
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        try {
            const submitData = {
                ...formData
            };

            let result;
            if (editMode) {
                result = await update(selectedEducation._id, submitData);
            } else {
                result = await create(submitData);
            }

            if (result.error) {
                setError(result.error);
            } else {
                handleClose();
                loadEducations();
            }
        } catch (err) {
            setError('Failed to save education record');
        }
    };

    const handleDelete = async (educationId) => {
        if (window.confirm('Are you sure you want to delete this education record?')) {
            try {
                const result = await remove(educationId);
                if (result.error) {
                    setError(result.error);
                } else {
                    loadEducations();
                }
            } catch (err) {
                setError('Failed to delete education record');
            }
        }
    };

    return (
        <>
            <h1>{auth.isAuthenticated() ? "My Education" : "My Services"}</h1>
            
            
            {!auth.isAuthenticated() && (
                <div className="default-services">
                    <div className="service-card">
                        <h3>💻Web Development</h3>
                        <p>Responsive websites using HTML, CSS, JavaScript, and React.</p>
                    </div>
                    <div className="service-card">
                        <h3>🌐Full-Stack Projects</h3>
                        <p>End-to-end applications using React, Node.js, and MongoDB.</p>
                    </div>
                    <div className="service-card">
                        <h3>⚙️Database Design</h3>
                        <p>Efficient relational and NoSQL database modeling using Oracle & MongoDB.</p>
                    </div>
                    <div className="service-card">
                        <h3>📱UI/UX Design</h3>
                        <p>Design user-centered interfaces that prioritize clarity, responsiveness, and usability.</p>
                    </div>
                </div>
            )}

            {auth.isAuthenticated() && (
                <div className="user-education">
                    <Box sx={{ position: 'relative', mb: 2 }}>
                        <Fab 
                            color="primary" 
                            aria-label="add" 
                            onClick={() => handleOpen()}
                            sx={{ position: 'fixed', bottom: 16, right: 16 }}
                        >
                            <AddIcon />
                        </Fab>
                    </Box>

                    {loading && <p>Loading your education data...</p>}
                    
                    {error && <p style={{color: 'red'}}>Error: {error}</p>}
                    
                    {!loading && !error && educations.length === 0 && (
                        <p>You haven't added any education records yet. Click the + button to add your first education record!</p>
                    )}
                    
                    {!loading && !error && educations.length > 0 && (
                        <div className="education-list">
                            {educations.map((education) => (
                                <Card key={education._id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h5" component="h3" gutterBottom>
                                            {education.title}
                                        </Typography>
                                        <Typography variant="h6" color="primary" gutterBottom>
                                            {education.firstname} {education.lastname}
                                        </Typography>
                                        <Typography variant="body1" paragraph>
                                            {education.description}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Completion Date:</strong> {new Date(education.completion).toLocaleDateString()}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <IconButton 
                                            color="primary" 
                                            onClick={() => handleOpen(education)}
                                            aria-label="edit"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            color="error" 
                                            onClick={() => handleDelete(education._id)}
                                            aria-label="delete"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Add/Edit Dialog */}
                    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                        <DialogTitle>
                            {editMode ? 'Edit Education Record' : 'Add New Education Record'}
                        </DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="title"
                                label="Education Title"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.title}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                name="firstname"
                                label="First Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.firstname}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                name="lastname"
                                label="Last Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.lastname}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                name="email"
                                label="Email"
                                type="email"
                                fullWidth
                                variant="outlined"
                                value={formData.email}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                name="completion"
                                label="Completion Date"
                                type="date"
                                fullWidth
                                variant="outlined"
                                value={formData.completion}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                name="description"
                                label="Description"
                                type="text"
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={handleSubmit} variant="contained">
                                {editMode ? 'Update' : 'Create'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )}
            <br />
        </>
    );
}