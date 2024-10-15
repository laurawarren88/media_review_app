import mongoose from 'mongoose';

const signupSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
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
export default mongoose.model('Signup', signupSchema);