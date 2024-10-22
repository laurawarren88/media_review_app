import express from 'express';
const router = express.Router();
import multer from 'multer';
import Book from '../models/bookModel.js';
import { ensureAdmin } from '../middleware/auth.js';

const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 } 
});

// Linking the review models for MongoDB collections 
import Review from '../models/reviewModel.js';
 
// Render the home page with all books
router.get('/', async (req, res) => {
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
router.get('/new', ensureAdmin, async (req, res) => {
    renderNewPage(res, new Book())
});

router.post('/', ensureAdmin, async (req, res) => { 
    const { title, author, category, description } = req.body;
    const book = new Book({
        title: title,
        author: author,
        category: category,
        description: description
    })
        saveCover(book, req.body.cover);

    try{
        const newBook = await book.save();
        res.redirect(`books/${newBook.id}`)
    }   catch {
            renderNewPage(res, book, true)
        };
    });

router.get('/advancedSearch', async (req, res) => {
    let searchOptions = {}

    const hasSearchParams = req.query.title || req.query.author || req.query.category;

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

        if (hasSearchParams) {
            books = await Book.find(searchOptions);
        }

        res.render('books/advancedSearch', {
            title: "Media Review App",
            books: books,
            searchOptions: {} 
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

router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        res.render('books/showBook', {book: book})
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
});

router.get('/:id/edit', ensureAdmin, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book)
    } catch {
        res.redirect('/')
    }
    
});

router.put('/:id', ensureAdmin, async (req,res) => {
    const { title, author, category, description, cover } = req.body;
    let book

    try {
        book = await Book.findById(req.params.id)
        book.title = title,
        book.author = author,
        book.category = category,
        book.description = description
        if (cover != null && cover !== '') {
            saveCover(book, cover);
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch {
        if (book != null) {
            renderEditPage(res, book, true)
        } else {
            redirect('/')
        }
    }
});

router.delete('/:id', ensureAdmin, async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id)
        if (!book) {
            return res.redirect('/');
        }
        await book.remove();
        res.redirect('/');
    } catch {
        res.redirect('/books')
    }
});

async function renderNewPage(res, book, hasError = false) {
    renderFormPage(res, book, 'newBook', hasError)
  };
  
  async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, 'editBook', hasError)
  };

//Function to link back to the new books page
async function renderFormPage(res, book, form, hasError = false) {
    try {
        const params = {
            title: "Media Review App",
            book: book
        }
        if (hasError) {
            if (form === 'edit') {
              params.errorMessage = 'Error Updating Book'
            } else {
              params.errorMessage = 'Error Creating Book'
            }
          }
          res.render(`books/${form}`, params)
    } catch {
        res.redirect(`/books`)
    }
};

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return;
    const cover = JSON.parse(coverEncoded);
    if (cover && cover.data && cover.type) {
        book.coverImage = Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type;
    }
}

export default router;