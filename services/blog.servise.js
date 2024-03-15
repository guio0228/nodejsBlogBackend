const { Blog } = require('../models');

console.log(Blog);
const createBlog = async (body) => {
  await Blog.create(body); // Corrected from res.body to req.body
};
const getBlog = async () => {
  const blogs = await Blog.find({}); // Blog.find({})是一个Mongoose操作，用于查询并返回数据库中Blog模型的所有文档
  return blogs;
};
const deleteBlog = async (id) => {
  await Blog.findByIdAndDelete(id);
};
// test
const editBlog = async (id, updateBody) => {
  const blog = await Blog.findById(id);
  if (!blog) {
    throw new Error('Blog not found');
  }
  Object.assign(blog, updateBody);
  await blog.save();
  return blog;
};
// test
module.exports = {
  createBlog,
  getBlog,
  deleteBlog,
  editBlog,
};
