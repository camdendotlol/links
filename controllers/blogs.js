const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const token = request.token

  if (!token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'missing title or URL' })
  }

  const blog = new Blog ({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    comments: [],
    user: user._id,
    liked_by: []
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const token = request.token

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'you do not have sufficient privileges to delete this resource' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.post('/:id/like', async (request, response) => {
  const token = request.token

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const link = await Blog.findById(request.params.id)

  if (!user.likes.toString().includes(link._id)) {
    const updatedLink = await Blog.findByIdAndUpdate(request.params.id, {
      likes: link.likes + 1,
      liked_by: link.liked_by.concat([user._id.toString()]) },
    { new: true }
    )

    user.likes = user.likes.concat(updatedLink._id)

    await updatedLink.save()
    await user.save()

    response.json(updatedLink)
  } else {
    const updatedLink = await Blog.findByIdAndUpdate(request.params.id, {
      likes: link.likes - 1,
      liked_by: link.liked_by.filter(userId => userId.toString() !== user._id.toString())
    },
    { new: true }
    )

    user.likes = user.likes.filter(linkId => linkId.toString() !== updatedLink._id.toString())

    await updatedLink.save()
    await user.save()

    response.json(updatedLink)
  }
})

// Old update function below, replaced for likes by the above function.
// Kept here in case editing features are added in the future

// blogsRouter.put('/:id', async (request, response) => {
//     const token = request.token

//     const decodedToken = jwt.verify(token, process.env.SECRET)
//     if (!token || !decodedToken.id) {
//         return response.status(401).json({ error: 'token missing or invalid' })
//     }

//     const body = request.body

//     const blog = {
//         title: body.title,
//         author: body.author,
//         url: body.url,
//         likes: body.likes,
//         comments: body.comments
//     }

//     const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

//     response.json(updatedBlog)
// })

blogsRouter.post('/:id/comments', async (request, response) => {
  const token = request.token

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const comment = request.body.data

  if (comment.length < 4) {
    return response.status(400).json({
      error: 'please enter at least 4 characters'
    })
  }

  const link = await Blog.findById(request.params.id)

  link.comments = link.comments.concat(comment)

  const savedLink = await link.save()
  response.json(savedLink)
})

module.exports = blogsRouter
