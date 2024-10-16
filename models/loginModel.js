import mongoose from 'mongoose';

const loginSchema = new mongoose.Schema({
    // *** Both username and password to be called from the sign up form ***
    
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// module.exports = mongoose.model('Book', bookSchema);
export default mongoose.model('Login', loginSchema);