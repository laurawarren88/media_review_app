import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
// *** The book title and book author are to come from the book schema
// *** The username is to come from the Login schema

    bookTitle: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book', 
        required: true 
    },
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
        required: true,
        maxlength: 250
    }
});

export default mongoose.model('Review', reviewSchema);