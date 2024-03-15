const httpStatus = require('http-status');
const catchAsync = require('../untils/catchAsync');
const { blogService } = require('../services');

const createBlog = catchAsync(async (req, res) => {
  // 传入请求体中的数据。
  await blogService.createBlog(req.body);
  // 创建成功后，返回201 CREATED状态码和成功消息。
  res.status(httpStatus.CREATED).send({ success: true, message: 'Blog created' });
});

const getBlog = catchAsync(async (req, res) => {
  // 获取博客列表。
  const blogs = await blogService.getBlog();
  // 获取成功后，返回200 OK状态码和博客列表。
  res.status(httpStatus.OK).json(blogs);
});

const deleteBlog = catchAsync(async (req, res) => {
  // 传入URL参数中的博客ID。
  await blogService.deleteBlog(req.params.id);
  // 删除成功后，返回200 OK状态码和成功消息。
  res.status(httpStatus.OK).send({ success: true, message: 'Blog deleted successfully' });
});

const editBlog = catchAsync(async (req, res) => {
  // 调用blogService的editBlog方法，传入URL参数中的博客ID和请求体中的更新数据。
  const blog = await blogService.editBlog(req.params.id, req.body);
  // 编辑成功后，返回200 OK状态码、成功消息和更新后的博客对象。
  res.status(httpStatus.OK).send({ success: true, message: 'Blog updated', blog });
});

// 导出处理函数，以便在路由定义中使用它们。
module.exports = {
  createBlog,
  getBlog,
  deleteBlog,
  editBlog,
};
