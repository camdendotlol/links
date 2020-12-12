import blogService from '../services/blogs'

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const displayBlog = id => {
  return async dispatch => {
    const blog = await blogService.getOne(id)
    dispatch({
      type: 'DISPLAY',
      data: blog
    })
  }
}

export const createBlog = (blogDetails) => {
  return async dispatch => {
    try{
      const response = await blogService.create(blogDetails.blog)
      const blogForState = { ...response, user: blogDetails.user }
      dispatch({
        type: 'CREATE',
        data: blogForState
      })
      return 1
    } catch (error) {
      return error
    }
  }
}

export const likeBlog = blogObject => {
  return async dispatch => {
    const blog = await blogService.toggleLike(blogObject)

    const savedUserObj = await window.localStorage.getItem('loggedBlogListUser')
    const savedUserJson = JSON.parse(savedUserObj)
    savedUserJson.likes = savedUserJson.likes.concat(blog.id)
    await window.localStorage.setItem('loggedBlogListUser', JSON.stringify(savedUserJson))

    dispatch({
      type: 'LIKE',
      data: blog
    })
  }
}

export const unlikeBlog = blogObject => {
  return async dispatch => {
    const blog = await blogService.toggleLike(blogObject)

    const savedUserObj = await window.localStorage.getItem('loggedBlogListUser')
    const savedUserJson = JSON.parse(savedUserObj)
    savedUserJson.likes = savedUserJson.likes.filter(id => id !== blog.id)
    await window.localStorage.setItem('loggedBlogListUser', JSON.stringify(savedUserJson))

    dispatch({
      type: 'UNLIKE',
      data: blog
    })
  }
}

export const deleteBlog = blog => {
  return async dispatch => {
    await blogService.deleteBlog(blog.id)
    dispatch({
      type: 'DELETE',
      data: blog.id
    })
  }
}

export const submitComment = (comment, id) => {
  return async dispatch => {
    const commentObject = {
      data: comment
    }
    await blogService.addComment(commentObject, id)
    dispatch({
      type: 'COMMENT',
      data: {
        comment: comment,
        id: id
      }
    })
  }
}

const blogReducer = (state = [], action) => {
  switch(action.type) {
  case 'INIT_BLOGS': {
    const blogs = action.data
    const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
    return sortedBlogs
  }
  case 'CREATE': {
    return [...state, action.data]
  }
  case 'LIKE': {
    const blogToLike = state.find(b => b.id === action.data.id)
    const updatedBlog = { ...blogToLike, likes: blogToLike.likes + 1 }
    return state.map(blog => blog.id !== blogToLike.id ? blog : updatedBlog)
  }
  case 'UNLIKE': {
    const blogToUnlike = state.find(b => b.id === action.data.id)
    const updatedBlog = { ...blogToUnlike, likes: blogToUnlike.likes - 1 }
    return state.map(blog => blog.id !== blogToUnlike.id ? blog : updatedBlog)
  }
  case 'DELETE': {
    const id = action.data
    return state.filter(blog => blog.id !== id)
  }
  case 'COMMENT': {
    const commentText = action.data.comment
    const blogId = action.data.id
    return state.map(blog => blog.id !== blogId ? blog : { ...blog, comments: blog.comments.concat(commentText) })
  }
  case 'DISPLAY':
    return action.data
  default:
    return state
  }
}

export default blogReducer