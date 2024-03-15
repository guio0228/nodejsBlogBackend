const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Blog = mongoose.model('Blog', blogSchema); // 創建模型
module.exports = Blog;
