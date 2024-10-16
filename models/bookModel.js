import mongoose from 'mongoose';
import path from 'path';

export const coverImageBasePath = 'uploads/bookCovers';

const bookSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    coverImageName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
    // This needs to link to the review schema - given by a user
    // averageRating: {
    //     // type; mongoose.Schema.types.ObjectId,
    //     // required: true,
    //     // ref: 'Review',
    //     type: Number,
    //     default: 5
    // }
});

bookSchema.virtual('coverImagePath').get(function() {
    if(this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
});

// module.exports = mongoose.model('Book', bookSchema);
export default mongoose.model('Book', bookSchema);