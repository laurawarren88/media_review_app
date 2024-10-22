import booksRouter from './books.js';
import userRouter from './user.js';
import reviewsRouter from './reviews.js';
import Book from '../models/bookModel.js';

const setupRoutes = (app) => {
    app.use('/books', booksRouter);
    app.use('/user', userRouter);
    app.use('/reviews', reviewsRouter);

    // Home page route
    app.get('/', async (req, res) => {
        let searchOptions = {};
        if (req.query.title != null && req.query.title !== '') {
            searchOptions.title = new RegExp(req.query.title, 'i'); // case insensitive
        }

        try {
            const books = await Book.find(searchOptions).limit(10).exec();
            res.render('index', {
                title: "Media Review App",
                books,
                searchOptions: {},
            });
        } catch (err) {
            res.render('index', { title: "Media Review App", books: [], searchOptions: req.query });
        }
    });
};

export default setupRoutes;