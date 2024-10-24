import express from 'express';
import Review from '../models/reviewModel.js';
import Book from '../models/bookModel.js';
import { ensureAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Displays all the reviews
router.get('/', async (req, res) => {
    try {
        const randomReviews = await Review.aggregate([{ $sample: { size: 5 } }]);
        const populatedReviews = await Review.populate(randomReviews, { 
            path: 'bookTitle',
            select: 'title author coverImage coverImageType'
        });

        // Transform Mongoose document to plain object
        const reviewsWithImages = populatedReviews.map(review => {
            const book = review.bookTitle.toObject(); 
            const coverImage = book.coverImage;
            const coverImageType = book.coverImageType;

            return {
                ...review,
                bookTitle: {
                    // ...book,
                    ...(book || { title: 'Unknown', author: 'Unknown', coverImage: null }),
                    coverImage: coverImage ? `data:${coverImageType};base64,${coverImage.toString('base64')}` : null
                }
            };
        });

        const books = await Book.find();

        res.render('reviews/indexReview', { 
            title: "Media Review App", 
            reviews: reviewsWithImages,
            books,
            currentUser: req.session.user
        });
    } catch (err) {
        console.error(err);
        res.render('partials/errorMessage', { errorMessage: 'Failed to load reviews' });
    }
});

router.get('/new', ensureAuthenticated, async (req, res) => {
    const bookId = req.query.bookId;
    
    try {
        let books;
        let book = null;
        
        if (bookId) {
            book = await Book.findById(bookId); 
        } else {
            books = await Book.find(); 
        }

        res.render('reviews/newReview', { 
            title: "Media Review App", 
            book, 
            books, 
            currentUser: req.session.user 
        });
    } catch (err) {
        console.error(err);
        res.render('partials/errorMessage', { errorMessage: 'Failed to load the review form' });
    }
});

router.post('/', ensureAuthenticated, async (req, res) => {
    console.log('Received form data:', req.body); 

    const { bookId, bookTitle, bookAuthor, rating, reviewText } = req.body;

    console.log("Received bookId:", bookId); 

    if (!req.session || !req.session.user) {
        return res.render('partials/errorMessage', { errorMessage: 'You must be logged in to leave a review' });
    }
    try {
        const book = await Book.findById(bookId);
        if (!book) {
            console.log("Book not found with ID:", bookId);
            return res.render('partials/errorMessage', { errorMessage: 'Book not found' });
        }

        const review = new Review({
            bookTitle: book._id,
            bookAuthor: book.author,
            username: req.session.user.username,
            rating: parseInt(rating),
            reviewText: reviewText && reviewText.trim() !== '' ? reviewText.trim() : null   
        });

        await review.save();
        res.redirect('/reviews');
    } catch (err) {
        console.error(err);
        res.render('partials/errorMessage', { errorMessage: 'Failed to add review' });
    }
});

router.post('/confirm', ensureAuthenticated, (req, res) => {
    const { bookId, bookTitle, bookAuthor,rating, reviewText } = req.body;  // Add bookId
    res.render('reviews/confirmReview', { bookTitle, bookAuthor, bookId, rating, reviewText });
});

router.get('/reviews/new/:id', ensureAuthenticated, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.render('partials/errorMessage', { errorMessage: 'Book not found' });
        }
        res.render('reviews/new', { book }); // Pass the book object to the template
    } catch (err) {
        console.error(err);
        res.render('partials/errorMessage', { errorMessage: 'Failed to load book' });
    }
});

export default router;