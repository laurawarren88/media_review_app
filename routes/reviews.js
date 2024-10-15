import express from 'express';
const router = express.Router();

// Linking the models for MongoDB collections
import Review from '../models/reviewsModel.js'

router.get('/main', (req, res) => {
    res.render('reviews/main', {title: "Media Review App"})
});

export default router;