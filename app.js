import express from 'express';
import expressLayouts from 'express-ejs-layouts'
import path from 'path';
import { fileURLToPath } from 'url';
// import ejsMate from 'ejs-mate';

const app = express();

// Server listening on port 3000 -localhost
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`)
      // npm run start
});

//View engine setup
// app.engine('ejs', ejsMate)
app.use(expressLayouts);
app.set('layout', './layouts/boilerplate');
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Additional file directories
// Be able to use __dirname with ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Call the home page
app.get('/', (req, res) => {
    res.render('home', {title: "Media Review App"})
});

app.get('/login', (req, res) => {
    res.render('login', {title: "Media Review App", layout: './layouts/auth'})
});

app.get('/signup', (req, res) => {
    res.render('signup', {title: "Media Review App", layout: './layouts/auth'})
});

app.get('/forgot_password', (req, res) => {
    res.render('forgot_password', {title: "Media Review App", layout: './layouts/auth'})
});

app.get('/review', (req, res) => {
    res.render('review', {title: "Media Review App"})
});