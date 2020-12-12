import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import AddBlogForm from './AddBlogForm'
import Toggleable from './Toggleable'
import { Link } from 'react-router-dom'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@material-ui/core'

const BlogList = () => {
  const blogs = useSelector(({ blogs }) => blogs)

  const blogFormRef = useRef()

  const blogForm = () => (
    <Toggleable buttonLabel='new link' buttonId='addBlog' ref={blogFormRef} >
      <AddBlogForm blogFormRef={blogFormRef} />
    </Toggleable>
  )

  return(
    <div>
      <h2>Links</h2>
      <p>sorted by likes</p>
      <div style={{ marginBottom: '20px' }}>
        {blogForm()}
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {blogs.map(blog =>
              <TableRow key={blog.id}>
                <TableCell>
                  {blog.likes}
                </TableCell>
                <TableCell>
                  <Link to={`/links/${blog.id}`}>{blog.title}</Link>
                </TableCell>
                <TableCell>
                  {blog.author}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BlogList