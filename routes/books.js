import express from 'express';
const router = express.Router();

// Linking the models for MongoDB collections
import Book from '../models/booksModel.js'
 
// Render the home page with all books
router.get('/main', (req, res) => {
    res.render('books/main', {title: "Media Review App"});
});

// Displays categories for books
router.get('/categories', (req, res) => {
    res.render('books/categories', {title: "Media Review App"});
});

export default router;