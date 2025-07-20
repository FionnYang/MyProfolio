import React, { useState, useEffect } from 'react';
import { listByUser, create, update, remove } from '../lib/api-project.js';
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

export default function Project() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        firstname: '',
        lastname: '',
        email: '',
        completion: ''
    });

    const loadProjects = async () => {
        const jwt = auth.isAuthenticated();
        if (jwt && jwt.token) {
            setLoading(true);
            setError('');

            try {
                const data = await listByUser();
                if (data?.error) {
                    setError(data.error);
                } else {
                    setProjects(data || []);
                }
            } catch (err) {
                console.error('Error loading projects:', err);
                setError('Failed to load projects');
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
            setProjects([]);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleOpen = (project = null) => {
        if (project) {
            setEditMode(true);
            setSelectedProject(project);
            setFormData({
                title: project.title,
                description: project.description,
                firstname: project.firstname,
                lastname: project.lastname,
                email: project.email,
                completion: project.completion.split('T')[0] // Format date for input
            });
        } else {
            setEditMode(false);
            setSelectedProject(null);
            setFormData({
                title: '',
                description: '',
                firstname: '',
                lastname: '',
                email: '',
                completion: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditMode(false);
        setSelectedProject(null);
        setFormData({
            title: '',
            description: '',
            firstname: '',
            lastname: '',
            email: '',
            completion: ''
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
                result = await update(selectedProject._id, formData);
            } else {
                result = await create(formData);
            }

            if (result.error) {
                setError(result.error);
            } else {
                handleClose();
                loadProjects(); // Reload the projects list
            }
        } catch (err) {
            setError('Failed to save project');
        }
    };

    const handleDelete = async (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                const result = await remove(projectId);
                if (result.error) {
                    setError(result.error);
                } else {
                    loadProjects(); // Reload the projects list
                }
            } catch (err) {
                setError('Failed to delete project');
            }
        }
    };

    return (
        <>
            <h1>My Projects</h1>
            
            
            {!auth.isAuthenticated() && (
                <div className="default-projects">
                    <h2>Pixar Gallery</h2>
                    <p>This project is a comprehensive web application that catalogs all Pixar movies 
                        released to date. It features a dynamic interface that allows users to explore 
                        the entire Pixar filmography with ease. The application includes advanced search 
                        and sorting functionalities, enabling users to filter movies by title, release 
                        year, or director. Users can quickly narrow down their results by selecting a 
                        specific year or choosing a director from a dropdown menu.</p>
                    <img src="/images/PixarGallery.png" alt="PixarGallery" className="project-image" />
                    
                    <h2>Pokémon Searcher</h2>
                    <p>This project is an interactive web application that allows users to search for 
                        Pokémon using the public Pokémon API (PokeAPI). Users can search by either Pokémon 
                        number (ID) or name, enabling flexible and efficient lookup functionality. Once 
                        a Pokémon is selected, the application displays comprehensive details, including 
                        type, abilities, base stats, and sprite images. Additionally, users can add their 
                        favorite Pokémon to a personalized favorites list for quick access in future 
                        sessions. The application emphasizes responsive design, intuitive user interaction, 
                        and seamless API integration. </p>
                    <img src="/images/Pokemon.png" alt="Pokemon" className="project-image" />

                    <h2>SPA Project</h2>
                    <p>This project focuses on the development and design of a Single Page Application (SPA) 
                        website that simulates the structure and functionality of a real-world service-based 
                        platform. The application includes core sections such as a homepage, a services overview, 
                        and an appointment booking feature. While many of the images and textual content are 
                        adapted from existing commercial websites for design reference, all layouts, components, 
                        and functionality have been independently implemented. </p>
                    <img src="/images/SPAproject.png" alt="SPAproject" className="project-image" />
                    <img src="/images/SPAproject2.png" alt="SPAproject2" className="project-image" />
                </div>
            )}

            {auth.isAuthenticated() && (
                <div className="user-projects">
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

                    {loading && <p>Loading your projects...</p>}
                    
                    {error && <p style={{color: 'red'}}>Error: {error}</p>}
                    
                    {!loading && !error && projects.length === 0 && (
                        <p>You haven't added any projects yet. Click the + button to add your first project!</p>
                    )}
                    
                    {!loading && !error && projects.length > 0 && (
                        <div className="projects-list">
                            {projects.map((project) => (
                                <Card key={project._id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h5" component="h3" gutterBottom>
                                            {project.title}
                                        </Typography>
                                        <Typography variant="body1" paragraph>
                                            {project.description}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Created by:</strong> {project.firstname} {project.lastname}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Email:</strong> {project.email}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Completion Date:</strong> {new Date(project.completion).toLocaleDateString()}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <IconButton 
                                            color="primary" 
                                            onClick={() => handleOpen(project)}
                                            aria-label="edit"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            color="error" 
                                            onClick={() => handleDelete(project._id)}
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
                            {editMode ? 'Edit Project' : 'Add New Project'}
                        </DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="title"
                                label="Project Title"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.title}
                                onChange={handleChange}
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