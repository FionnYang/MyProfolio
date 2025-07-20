import React, { useState, useEffect } from 'react';
import { listByUser, create, update, remove } from '../lib/api-contact.js';
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

export default function Contact() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: ''
    });

    const loadContacts = async () => {
        const jwt = auth.isAuthenticated();
        if (jwt && jwt.token) {
            setLoading(true);
            setError('');

            try {
                const data = await listByUser();
                if (data?.error) {
                    setError(data.error);
                } else {
                    setContacts(data || []);
                }
            } catch (err) {
                console.error('Error loading contacts:', err);
                setError('Failed to load contact data');
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
            setContacts([]);
        }
    };

    useEffect(() => {
        loadContacts();
    }, []);

    const handleOpen = (contact = null) => {
        if (contact) {
            setEditMode(true);
            setSelectedContact(contact);
            setFormData({
                firstname: contact.firstname,
                lastname: contact.lastname,
                email: contact.email
            });
        } else {
            setEditMode(false);
            setSelectedContact(null);
            setFormData({
                firstname: '',
                lastname: '',
                email: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditMode(false);
        setSelectedContact(null);
        setFormData({
            firstname: '',
            lastname: '',
            email: ''
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
            let result;
            if (editMode) {
                result = await update(selectedContact._id, formData);
            } else {
                result = await create(formData);
            }

            if (result.error) {
                setError(result.error);
            } else {
                handleClose();
                loadContacts();
            }
        } catch (err) {
            setError('Failed to save contact');
        }
    };

    const handleDelete = async (contactId) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            try {
                const result = await remove(contactId);
                if (result.error) {
                    setError(result.error);
                } else {
                    loadContacts();
                }
            } catch (err) {
                setError('Failed to delete contact');
            }
        }
    };

    return (
        <>
            <h1>{auth.isAuthenticated() ? "My Contact Records" : "My Contact"}</h1>
            
            {!auth.isAuthenticated() && (
                <div className="contact-container">
                    <div className="contact-info">
                        <h2>Contact Information</h2>
                        <p>📧 Email: fyyang285@gmail.com</p>
                        <p>📞 Phone: +1 (437) 858-8890</p>
                        <p>🌐 Location: Centennial College</p>
                    </div>
                    <div className="contact-form">
                        <form action="/" method="get">
                            <label htmlFor="fname">First Name</label>
                            <input type="text" id="fname" name="fname" required />

                            <label htmlFor="lname">Last Name</label>
                            <input type="text" id="lname" name="lname" required />

                            <label htmlFor="phone">Contact Number</label>
                            <input type="tel" id="phone" name="phone" />

                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" name="email" required />

                            <label htmlFor="message">Message</label>
                            <textarea id="message" name="message" required></textarea>

                            <button type="submit" className="submit-button">Send Message</button>
                        </form>
                    </div>
                </div>
            )}

            {auth.isAuthenticated() && (
                <div className="user-contacts">
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

                    {loading && <p>Loading your contact records...</p>}
                    
                    {error && <p style={{color: 'red'}}>Error: {error}</p>}
                    
                    {!loading && !error && contacts.length === 0 && (
                        <p>You haven't added any contact records yet. Click the + button to add your first contact!</p>
                    )}
                    
                    {!loading && !error && contacts.length > 0 && (
                        <div className="contacts-list">
                            {contacts.map((contact) => (
                                <Card key={contact._id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h5" component="h3" gutterBottom>
                                            {contact.firstname} {contact.lastname}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Email:</strong> {contact.email}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <IconButton 
                                            color="primary" 
                                            onClick={() => handleOpen(contact)}
                                            aria-label="edit"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            color="error" 
                                            onClick={() => handleDelete(contact._id)}
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
                            {editMode ? 'Edit Contact' : 'Add New Contact'}
                        </DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
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
        </>
    );
}