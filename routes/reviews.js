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
                    ...book,
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

// router.get('/new', ensureAuthenticated, async (req, res) => {
//     try {
//         const bookId = req.query.bookId;
//         const book = await Book.findById(bookId); 

//         if (!book) {
//             return res.render('partials/errorMessage', { errorMessage: 'Book not found' });
//         }

//         const books = await Book.find();

//         res.render('reviews/newReview', { 
//             title: "Media Review App",
//             books, 
//             currentUser: req.session.user 
//         });
//     } catch (err) {
//         console.error(err);
//         res.render('partials/errorMessage', { errorMessage: 'Failed to load books for review' });
//     }
// });

router.get('/new', ensureAuthenticated, async (req, res) => {
    try {
        const bookId = req.query.bookId; // Get bookId from query string
        const book = await Book.findById(bookId); // Find the book

        if (!book) {
            return res.render('partials/errorMessage', { errorMessage: 'Book not found' });
        }

        // Fetch all books for the dropdown
        const books = await Book.find(); // Adjust this based on your requirement

        // Render the review form with the selected book
        res.render('reviews/newReview', { 
            title: "Media Review App", 
            book, // Pass the selected book details
            books, // Pass the books array for the dropdown
            currentUser: req.session.user 
        });
    } catch (err) {
        console.error(err);
        res.render('partials/errorMessage', { errorMessage: 'Failed to load books for review' });
    }
});

router.post('/', ensureAuthenticated, async (req, res) => {
    const { bookTitle, bookAuthor, rating, reviewText } = req.body;

    if (!req.session || !req.session.user) {
        return res.render('partials/errorMessage', { errorMessage: 'You must be logged in to leave a review' });
    }
    try {
        const book = await Book.findById(bookTitle, bookAuthor);
        if (!book) {
            return res.render('partials/errorMessage', { errorMessage: 'Book not found' });
        }

        const review = new Review({
            bookTitle: book._id,
            bookAuthor: book.author,
            username: req.session.user.username,
            rating: parseInt(rating),
            reviewText: reviewText ? reviewText.trim() : ''  
        });

        await review.save();
        res.redirect('/reviews');
    } catch (err) {
        console.error(err);
        res.render('partials/errorMessage', { errorMessage: 'Failed to add review' });
    }
});

router.post('/confirm', ensureAuthenticated, (req, res) => {
    const { bookTitle, bookAuthor, rating, reviewText } = req.body;
    res.render('reviews/confirmReview', { bookTitle, bookAuthor, rating, reviewText });
});

export default router;