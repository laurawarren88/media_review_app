import express from 'express';
import path from 'path';
import multer from 'multer';
import fs from 'fs';

// Linking the books models for MongoDB collections and saving cover images to a file
import Book, { coverImageBasePath } from '../models/bookModel.js';

const router = express.Router();

const uploadPath = path.join('public', coverImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']; //The images the upload function supports
const upload = multer ({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        const isValid = imageMimeTypes.includes(file.mimetype);
        callback(null, isValid);
        if (!isValid) {
            callback(new Error('Invalid file type. Only images are allowed.'));
        }
    }
});

// Linking the review models for MongoDB collections 
import Review from '../models/reviewModel.js';
 
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
            searchOptions: {}
    })} catch {
        res.redirect('/')
    }
});

// **** At the moment anyone can add a book but need to chnage this to only admin ****
router.get('/new', (req, res) => {
    renderNewPage(res, new Book())
});

router.post('/', upload.single('cover'), async (req, res) => {
    console.log('File uploaded:', req.file);
    const filename = req.file != null ? req.file.filename : null;
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        category: req.body.category,
        coverImageName: filename,
        description: req.body.description
    });
    try{
        const newBook = await book.save();
        // res.redirect(`books/${newBook.id}`)
        res.redirect('books');
    }   catch {
        if (book.coverImageName != null) {
            removeBookCover(book.coverImageName)
        }
            renderNewPage(res, book, true)
        };
    });

router.get('/advancedSearch', async (req, res) => {
    let searchOptions = {}

    // Check if title, author, or category is provided
    const hasSearchParams = req.query.title || req.query.author || req.query.category;

    // Only add to searchOptions if there are search parameters
    if (req.query.title) {
        searchOptions.title = new RegExp(req.query.title, 'i');
    }

    if (req.query.author) {
        searchOptions.author = new RegExp(req.query.author, 'i');
    }

    if (req.query.category) {
        searchOptions.category = new RegExp(req.query.category, 'i');
    }

    try {
        let books = [];

        // Only search if there are search parameters
        if (hasSearchParams) {
            books = await Book.find(searchOptions);
        }

        res.render('books/advancedSearch', {
            title: "Media Review App",
            books: books,
            searchOptions: {} // Clears the input fields populated with the user's search
        });
    } catch (error) {
        console.error(error);
        res.redirect('/books');
    }
});



// Displays categories for books
router.get('/categories', (req, res) => {
    res.render('books/categories', {title: "Media Review App"});
});

// Function to remove a book cover when an error occured creating a book
function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.log(err)
    })
}

//Function to link back to the new books page
async function renderNewPage(res, book, hasError = false) {
    try {
        const params = {
            title: "Media Review App",
            book: book
        }
        if (hasError) params.errorMessage = 'Error Creating Book'
        res.render('books/newBook', params ) 
    } catch {
        res.redirect('/books')
    }
};

export default router;