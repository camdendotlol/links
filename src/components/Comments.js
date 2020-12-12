import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createNotification } from '../reducers/notificationReducer'
import { submitComment } from '../reducers/blogReducer'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  TextField
} from '@material-ui/core'

const Comments = ({ link }) => {
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()

  const addComment = async (event) => {
    event.preventDefault()

    dispatch(submitComment(comment, link.id))

    dispatch(createNotification({
      text: `Added "${comment}"`,
      type: 'notification'
    }, 5))

    setComment('')
  }

  const handleCommentFormChange = (event) => {
    setComment(event.target.value)
  }

  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h3 style={{ display: 'inline' }}>Comments</h3>
        <span style={{ fontSize: '0.7em', color: 'gray', marginLeft: '10px' }}>speak your mind - comments are anonymous</span>
      </div>
      <form onSubmit={addComment} style={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          label="new comment"
          id='comment'
          value={comment}
          onChange={handleCommentFormChange}
        />
        <Button variant="contained" color="primary" id="submitComment" type="submit" style={{ marginLeft: '10px', height: '30px' }}>add</Button>
      </form>
      <TableContainer component={Paper} style={{ marginTop: '10px' }}>
        <Table>
          <TableBody>
            {link.comments.map(comment =>
              <TableRow key={Math.random()}>
                <TableCell>
                  {comment}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Comments