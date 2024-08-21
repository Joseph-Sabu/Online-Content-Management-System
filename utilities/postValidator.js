const { body } = require('express-validator');

const postValidator = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('slug').trim().notEmpty().withMessage('Slug is required'),
    body('content').trim().notEmpty().withMessage('Content is required')
];

module.exports = postValidator;
