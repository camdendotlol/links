import React from 'react'
import { Link } from 'react-router-dom'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@material-ui/core'

const SingleUser = ({ user }) => {
  if (!user) {
    return null
  }

  const links = user.blogs

  if (user.blogs.length === 0) {
    return (
      <div>
        <h3>Posts by {user.name}</h3>
        <p>there&apos;s nothing here :(</p>
      </div>
    )
  }

  return (
    <div>
      <h3>Posts by {user.name}</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {links.map(link =>
              <TableRow key={link.id}>
                <TableCell>
                  <Link to={`/links/${link.id}`}>{link.title}</Link>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default SingleUser