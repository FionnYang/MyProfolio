import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Title is required',
    trim: true
  },
  firstname: {
    type: String,
    required: 'First name is required',
    trim: true
  },
  lastname: {
    type: String,
    required: 'Last name is required',
    trim: true
  },
  email: {
    type: String,
    required: 'Email is required',
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  completion: {
    type: Date,
    required: 'Completion date is required'
  },
  description: {
    type: String,
    trim: true
  }
});

export default mongoose.model('Project', projectSchema);