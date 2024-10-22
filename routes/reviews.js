import express from 'express';
import Review from '../models/reviewModel.js';
import Book from '../models/bookModel.js';
import { ensureAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Displays all the reviews
router.get('/', async (req, res) => {
    try {
        const randomReviews = await Review.aggregate([{ $sample: { size: 5 } }]);
        const populatedReviews = await Review.populate(randomReviews, { path: 'bookTitle' });
        res.render('reviews/indexReview', { title: "Media Review App", reviews: populatedReviews });
    } catch (err) {
        console.error(err);
        res.render('partials/errorMessage', { errorMessage: 'Failed to load reviews' });
    }
});

router.get('/new', ensureAuthenticated, async (req, res) => {
    try {
        const books = await Book.find();
        res.render('reviews/newReview', { 
            title: "Media Review App", 
            books, 
            user: req.session.user
        });
    } catch (err) {
        res.render('partials/errorMessage', { errorMessage: 'Failed to load books for review' });
    }
});

router.post('/', ensureAuthenticated, async (req, res) => {
    const { bookTitle, rating, reviewText } = req.body;

    try {
        const book = await Book.findOne({ title: bookTitle });
        if (!book) {
            return res.render('partials/errorMessage', { errorMessage: 'Book not found' });
        }

        const review = new Review({
            bookTitle: book._id,
            username: req.user.username,
            rating: parseInt(rating),
            reviewText: reviewText.trim()
        });

        await review.save();
        res.redirect('/reviews');
    } catch (err) {
        console.error(err);
        res.render('partials/errorMessage', { errorMessage: 'Failed to add review' });
    }
});

router.post('/confirm', ensureAuthenticated, (req, res) => {
    const { bookTitle, rating, reviewText } = req.body;
    res.render('reviews/confirm', { bookTitle, rating, reviewText });
});

export default router;