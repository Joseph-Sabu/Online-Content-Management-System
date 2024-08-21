const Article = require('../models/article');

function index(req, res) {
    Article.find({}).exec().then((posts) => {
        res.render('index', { posts, session: req.session });
    }).catch(err => console.log(err));
}

module.exports = index;
