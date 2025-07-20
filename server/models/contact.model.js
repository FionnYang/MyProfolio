import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
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
  }
});

export default mongoose.model('Contact', contactSchema);