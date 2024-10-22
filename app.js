import express from 'express';
import 'dotenv/config';
import session from 'express-session';
import expressLayouts from 'express-ejs-layouts';
import methodOverride from 'method-override';
import { fileURLToPath } from 'url';
import path from 'path';

import connectDB from './db.js';
import setupSessionStore from './sessionStore.js';
import setupRoutes from './routes/index.js';

const app = express();

// Connect to MongoDB
connectDB();

const sessionStore = setupSessionStore();
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

if (process.env.NODE_ENV !== 'production') {
    console.log('Development mode: Loading environment variables');
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(methodOverride('_method'));
app.use(expressLayouts);
app.set('layout', './layouts/boilerplate');
app.set('view engine', 'ejs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null; 
    res.locals.isLoggedIn = !!req.session.user; 
    next();
});

setupRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`)
});