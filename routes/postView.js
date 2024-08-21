const Article = require('../models/article');

function postView(req, res) {
    const slug = req.params.slug;

    Article.findOne({ slug: slug }).exec().then((post) => {
        if (!post) {
            return res.status(404).send('Post not found');
        }

        res.render('postDetail', { post, session: req.session });
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Server error');
    });
}

module.exports = postView;
