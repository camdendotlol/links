import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { createNotification } from '../reducers/notificationReducer'

import { TextField, Button } from '@material-ui/core'

const AddBlogForm = ({ blogFormRef }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const dispatch = useDispatch()

  // must add user info to the new link in the state.
  // otherwise, the user tag will be missing from new link's state until a refresh.
  const user = useSelector(({ user }) => user)

  const addBlog = async (event) => {
    event.preventDefault()

    const blogObject = {
      blog: {
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl
      },
      user: user
    }

    const response = await dispatch(createBlog(blogObject))

    if (response.toString().includes('Request failed with status code 400')) {
      return dispatch(createNotification({
        text: 'Title and URL are required',
        type: 'error'
      }, 5))
    }

    blogFormRef.current.toggleVisibility()

    dispatch(createNotification({
      text: `Added "${blogObject.blog.title}" by ${blogObject.blog.author}`,
      type: 'notification'
    }, 5))

    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }

  const handleBlogTitleChange = (event) => {
    setNewBlogTitle(event.target.value)
  }

  const handleBlogAuthorChange = (event) => {
    setNewBlogAuthor(event.target.value)
  }

  const handleBlogUrlChange = (event) => {
    setNewBlogUrl(event.target.value)
  }

  return (
    <div>
      <h3>New post</h3>
      <form onSubmit={addBlog}>
        <div>
          <TextField label="Title" id='newBlogTitle' onChange={handleBlogTitleChange} value={newBlogTitle} style={{ width: '100%', maxWidth: '500px' }} />
        </div>
        <div>
          <TextField label="Author" id='newBlogAuthor' value={newBlogAuthor} onChange={handleBlogAuthorChange} style={{ width: '100%', maxWidth: '500px' }} />
        </div>
        <div>
          <TextField label="URL" id='newBlogUrl' value={newBlogUrl} onChange={handleBlogUrlChange} style={{ width: '100%', maxWidth: '500px' }} />
        </div>
        <Button variant="contained" color="primary" id="submitBlog" type="submit">add</Button>
      </form>
    </div>
  )
}

export default AddBlogForm