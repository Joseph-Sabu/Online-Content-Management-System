const express = require('express');
const path = require('node:path');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const indexRoute = require('./routes/index');
const postListRoute = require('./routes/postList');
const postHandler = require('./routes/postHandler');
const postView = require('./routes/postView');
const userAuth = require('./routes/userAuth');
const ensureAuthenticated = require('./middleware/authentication');
const postValidator = require('./utilities/postValidator'); 

const app = express();

mongoose.connect('mongodb://localhost:27017/blogCMS');

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method')); 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
app.use(fileUpload()); 

app.use(session({
    secret: 'secret123',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', userAuth); 
app.get('/', indexRoute);
app.get('/admin/posts', ensureAuthenticated, postListRoute);
app.get('/admin/posts/new', ensureAuthenticated, (req, res) => res.render('postForm', { errors: [], post: {}, session: req.session }));
app.get('/admin/posts/:id/edit', ensureAuthenticated, postHandler);
app.get('/post/:slug', postView);
app.post('/admin/posts', ensureAuthenticated, postValidator, postHandler); 
app.post('/admin/posts/:id', ensureAuthenticated, postValidator, postHandler); 
app.delete('/admin/posts/:id', ensureAuthenticated, postHandler); 

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
