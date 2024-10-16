import express from 'express';
const router = express.Router();

// Linking the models for MongoDB collections
import Review from '../models/reviewModel.js';

// Displays all the reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({})
        res.render('reviews/indexReview', {title: "Media Review App", reviews: reviews})
    }   catch {
        res.redirect('/')
    }
});

// Displays the form to input a review
router.get('/new', (req, res) => {
    res.render('reviews/newReview', { title: "Media Review App", review: new Review() })
});

// Posts a single review
router.post('/', async (req, res) => {
    // res.send('Create')
    // res.send(req.body.reviewText)
    const review = new Review({
        reviewText: req.body.reviewText
    });
    try {
        const newReview = await review.save();
        // res.redirect(`reviews/${newReviewText.id}`)
        res.redirect('reviews');
        } catch (err) {
            res.render('reviews/newReview', {
            review: review,
            errorMessage: 'Error creating Review'
        });
    }
});

export default router;