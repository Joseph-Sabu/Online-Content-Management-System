const Article = require('../models/article');
const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator');

async function postHandler(req, res) {
    if (req.method === 'GET') {
        const postId = req.params.id;

        try {
            const post = await Article.findById(postId).exec();
            res.render('postForm', { errors: [], post, session: req.session });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error fetching post');
        }
    } else if (req.method === 'POST') {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('postForm', { errors: errors.array(), post: req.body, session: req.session });
        }

        const { title, slug, content } = req.body;
        const postId = req.params.id;
        let imagePath = '';

        if (req.files && req.files.image) {
            const imageFile = req.files.image;
            imagePath = '/uploads/' + Date.now() + path.extname(imageFile.name);
            const uploadPath = path.join(__dirname, '..', imagePath);

            try {
                await imageFile.mv(uploadPath);
            } catch (err) {
                console.error('Error uploading file:', err);
                return res.status(500).send('Error uploading file');
            }
        }

        let postDetails = { title, slug, content };
        if (imagePath) {
            postDetails.image = imagePath;
        }

        try {
            if (postId) {
                await Article.findByIdAndUpdate(postId, postDetails).exec();
            } else {
                const newPost = new Article(postDetails);
                await newPost.save();
            }
            res.redirect('/admin/posts');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error saving post');
        }
    } else if (req.method === 'DELETE') {
        const postId = req.params.id;

        try {
            const post = await Article.findById(postId).exec();
            if (!post) {
                return res.status(404).send('Post not found');
            }

            if (post.image) {
                const imagePath = path.join(__dirname, '..', post.image);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Error deleting image file:', err);
                    }
                });
            }

            await Article.findByIdAndDelete(postId).exec();
            res.redirect('/admin/posts');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error deleting post');
        }
    }
}

module.exports = postHandler;
