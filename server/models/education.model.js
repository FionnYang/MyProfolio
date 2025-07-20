import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Title is required',
    trim: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'User is required'
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

export default mongoose.model('Education', educationSchema);