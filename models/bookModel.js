import mongoose from 'mongoose';
import { type } from 'os';
import path from 'path';

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
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
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
    if(this.coverImage != null && this.coverImageType != null ) {
        return `data:${this.coverImageType};charset=utf;base64,${this.coverImage.toString('base64')}`
    }
});

export default mongoose.model('Book', bookSchema);