import express from 'express';
const router = express.Router();

// Linking the models for MongoDB collections
import Book from '../models/bookModel.js'
 
// Render the home page with all books
router.get('/', async (req, res) => {
    
    // These are our search options in the search form - searching by title
    let searchOptions = {}
    if (req.query.title != null && req.query.title !== '') {
        searchOptions.title = new RegExp(req.query.title, 'i') //The i feature returns the search query whether upper or lowercase
    }
    try {
        const books = await Book.find(searchOptions)
        res.render('books/indexBooks', {
            title: "Media Review App", 
            books: books, 
            searchOptions: req.query})
    }   catch {
        res.redirect('/')
    }
});


// **** At the moment anyone can add a book but need to chnage this to only admin ****
// Displays the form to input a review
router.get('/new', (req, res) => {
    res.render('books/newBook', { title: "Media Review App", book: new Book() })
});

// Posts a single review
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title
    });
    try {
        const newBook = await book.save();
        // res.redirect(`reviews/${newReviewText.id}`)
        res.redirect('books');
        } catch (err) {
            res.render('books/newBook', {
            book: book,
            errorMessage: 'Error creating New Book'
        });
    }
});

// Displays categories for books
router.get('/categories', (req, res) => {
    res.render('books/categories', {title: "Media Review App"});
});

export default router;