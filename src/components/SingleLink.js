import React from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { likeBlog, unlikeBlog, deleteBlog as linkDelete } from '../reducers/blogReducer'
import { createNotification } from '../reducers/notificationReducer'
import { useHistory } from 'react-router-dom'
import Comments from './Comments'

import { Card, CardContent, Typography } from '@material-ui/core'



const SingleLink = ({ link }) => {
  const user = useSelector(({ user }) => user)

  const dispatch = useDispatch()
  const history = useHistory()

  if (!link) {
    return null
  }

  const handleLikes = user => {
    if (user) {
      return (
        <Typography style={{ textAlign: 'center', marginRight: '15px' }}>
          <span onClick={toggleLike} style={{ cursor: 'pointer' }}>{chooseLikeButtonImg()}<br />{link.likes} likes</span>
        </Typography>
      )
    } else {
      return null
    }
  }

  const isLiked = () => {
    if (user.likes.toString().includes(link.id.toString())) {
      return true
    } else {
      return false
    }
  }

  const chooseLikeButtonImg = () => {
    if (isLiked()) {
      return (
        <svg id="unlike" style={{ color: '#ff0800', position: 'relative', top: '4px' }} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-heart-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
        </svg>
      )
    } else {
      return (
        <svg id="like" style={{ position: 'relative', top: '4px' }} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-heart" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
        </svg>
      )
    }
  }

  const showDeleteButton = () => {
    if (user && link.user.username === user.username) {
      return (
        <span onClick={deleteLink} style={{ cursor: 'pointer', position: 'relative', top: '2px' }}>
          <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
          </svg>
        </span>
      )
    } else {
      return null
    }
  }

  const deleteLink = async () => {
    if (window.confirm(`Are you sure you want to delete "${link.title}"?`)) {
      try {
        await dispatch(linkDelete(link))
        dispatch(createNotification({
          text: `Deleted ${link.title} by ${link.author}`,
          type: 'notification'
        }, 5))
        history.push('/links')
      } catch (exception) {
        dispatch(createNotification({
          text: 'You are not authorized to delete this blog',
          type: 'error'
        }, 5))
      }
    }
  }

  const toggleLike = async () => {
    if (!isLiked()) {
      await dispatch(likeBlog(link))
    } else {
      await dispatch(unlikeBlog(link))
    }
  }

  return (
    <div>
      <Card>
        <CardContent style={{ display: 'flex', alignItems: 'center' }}>
          { handleLikes(user) }
          <div>
            <Typography color="textSecondary">
              <p style={{ marginBottom: 0, marginTop: 0 }}>shared by {link.user.name} {showDeleteButton()}</p>
            </Typography>
            <Typography>
              <h1 style={{ marginBottom: 0, marginTop: 0 }}>{link.title}</h1>
            </Typography>
            <Typography variant="body2">
              <p style={{ marginBottom: 0, marginTop: 0 }}>by {link.author}</p>
            </Typography>
            <Typography>
              <p style={{ marginBottom: 0, marginTop: 0 }}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a></p>
            </Typography>
          </div>
        </CardContent>
      </Card>
      <Comments link={link}/>
    </div>
  )
}

export default SingleLink