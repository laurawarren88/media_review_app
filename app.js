import express from 'express';
import methodOverride from 'method-override'; 
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import mongoose from 'mongoose';
import 'dotenv/config';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
// import ejsMate from 'ejs-mate';

//Import the different routes
import booksRouter from './routes/books.js';
import userRouter from './routes/user.js';
import reviewsRouter from './routes/reviews.js';

// Import book model
import Book from './models/bookModel.js';

const app = express();

// Load environment variables only in development mode
if (process.env.NODE_ENV !== 'production') {
    console.log('Development mode: Loading environment variables');
}

// Connecting to MongoDB
const DATABASE_URL = process.env.DATABASE_URL;
mongoose.connect(DATABASE_URL)
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('Error connecting to MongoDB:', error));

// Listen for MongoDB connection events (optional)
const db = mongoose.connection;
db.on('error', error => console.error('MongoDB connection error:', error));
db.once('open', () => console.log('MongoDB connection is open'));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({limit: '10mb', extended: false}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}));
app.use(methodOverride('_method'));

//View engine setup
// app.engine('ejs', ejsMate)
app.use(expressLayouts);
app.set('layout', './layouts/boilerplate');
app.set('view engine', 'ejs');

//Additional file directories and be able to use __dirname with ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Render the home page
app.get('/', async (req, res) => {
  // These are our search options in the search form - searching by title
  let searchOptions = {}
  if (req.query.title != null && req.query.title !== '') {
      searchOptions.title = new RegExp(req.query.title, 'i') //The i feature returns the search query whether upper or lowercase
  }
  let books;
  try {
    books = await Book.find().sort({ createAt: 'desc' }).limit(10).exec() // Shows the books in created decending order - limited to 10. 
  }  catch {
      books = [];
   } 
   books = await Book.find(searchOptions)
   res.render('index', {
    title: "Media Review App",
    books: books,
    searchOptions: {}
  })
});

// Link all the routes to the different pages
app.use('/books', booksRouter);
app.use('/user', userRouter);
app.use('/reviews', reviewsRouter);

// Server listening on port 3000 -localhost
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`)
      // npm run start - to run/start the application
});