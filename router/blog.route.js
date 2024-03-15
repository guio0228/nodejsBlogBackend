const express = require('express');

const router = express.Router();
const { blogValidation } = require('../validations');
const validate = require('../middlewares/validate');
const { blogController } = require('../controller');
const auth = require('../middlewares/auth');

router.get('/blogs', auth, blogController.getBlog);
router.post('/blog', auth, validate(blogValidation.createBlogSchema), blogController.createBlog);
router.delete('/delBlogs/:id', blogController.deleteBlog);
router.patch('/editBlogs/:id', blogController.editBlog);
module.exports = router;
