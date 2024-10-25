import express from 'express';
const router = express.Router();
import Book from '../models/bookModel.js';
import Review from '../models/reviewModel.js';
import { ensureAdmin } from '../middleware/auth.js';

router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.title != null && req.query.title !== '') {
        searchOptions.title = new RegExp(req.query.title, 'i') 
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
        res.redirect('books')
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

router.get('/:id', async (req, res) => {
    try {
        const bookId = req.params.id; 
        const book = await Book.findById(bookId);
        if (book) {
            res.render('books/showBook', {book: book})
        } else {
            res.render('partials/errorMessage', { errorMessage: 'No information for this book!' });
        }
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

router.put('/:id', ensureAdmin, async (req, res) => {
    const { title, author, category, description, cover } = req.body;
    let book;

    try {
        book = await Book.findById(req.params.id);
        book.title = title;
        book.author = author;
        book.category = category;
        book.description = description;

        if (cover && cover !== '') {
            await saveCover(book, cover);
        }

        await book.save();
        res.redirect(`/books/${book.id}`);
    } catch (err) {
        console.error(err);
        if (book != null) {
            renderEditPage(res, book, true);
        } else {
            res.redirect('/');
        }
    }
});

router.delete('/:id', ensureAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await Review.deleteMany({ bookTitle: id }); 
    
        const deletedBook = await Book.findByIdAndDelete(id);
        
        if (!deletedBook) {
            console.log(`No book found with ID: ${id}`);
            return res.redirect('/'); 
        }

        res.redirect('/'); 
    } catch (err) {
        console.error(`Error deleting book with ID: ${id}`, err);
        res.redirect('/books'); 
    }
});

async function renderNewPage(res, book, hasError = false) {
    renderFormPage(res, book, 'newBook', hasError)
  };
  
  async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, 'editBook', hasError)
  };

  async function renderFormPage(res, book, form, hasError = false) {
    const formattedCoverImage = book.coverImage ? 
        `data:${book.coverImageType};base64,${book.coverImage.toString('base64')}` : null;

    const params = {
        title: "Media Review App",
        book: {
            ...book.toObject(),
            coverImage: formattedCoverImage 
        }
    };
    if (hasError) {
        if (form === 'edit') {
          params.errorMessage = 'Error Updating Book'
        } else {
          params.errorMessage = 'Error Creating Book'
        }
      }
    res.render(`books/${form}`, params)
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