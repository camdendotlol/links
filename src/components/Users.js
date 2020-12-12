import React from 'react'

import { Link } from 'react-router-dom'

const Users = ({ users }) => {
  const sortedUsers = users.sort((a, b) => b.blogs.length - a.blogs.length)

  return (
    <div>
      <h2>All users</h2>
      <ol>
        {sortedUsers.map(user =>
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link> - {user.blogs.length} links
          </li>
        )}
      </ol>
    </div>
  )
}

export default Users