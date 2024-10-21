import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
// *** The book title and book author are to come from the book schema ***
// *** The username is to come from the Login schema

    bookTitle: { 
        type: String, 
        ref: 'Book', 
        required: true 
    },  // Linking to the book collection by title
    bookAuthor: { 
        type: String, 
        ef: 'Book', 
        required: true
    }, // Linking to the book collection by author
    username: { 
        type: String, 
        required: true 
    },  
    rating: { 
        type: Number, 
        required: true, 
        min: 1, max: 5 
    },  
    reviewText: { 
        type: String, 
        required: true 
    }
});

export default mongoose.model('Review', reviewSchema);