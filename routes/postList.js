const Article = require('../models/article');

function postList(req, res) {
    Article.find({}).exec().then((posts) => {
        res.render('postList', { posts, session: req.session });
    }).catch(err => console.log(err));
}

module.exports = postList;
