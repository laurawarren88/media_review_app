import mongoose from 'mongoose';

const booksSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    averageRating: {
        type: Number,
        default: 5
    }
});

// module.exports = mongoose.model('Book', bookSchema);
export default mongoose.model('Book', booksSchema);