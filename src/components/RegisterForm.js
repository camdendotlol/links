import React, { useState } from 'react'

import { TextField, Button } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { registerUser } from '../reducers/userReducer'
import { createNotification } from '../reducers/notificationReducer'

const RegisterForm = () => {
  const dispatch = useDispatch()

  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [realName, setRealName] = useState('')
  const [invite, setInvite] = useState('')

  const handleSignup = async (event) => {
    event.preventDefault()

    const response = await dispatch(registerUser({
      'username': username,
      'name': realName,
      'password': password,
      'invite_key': invite
    }))

    if (response.toString().includes('Request failed with status code 401')) {
      return dispatch(createNotification({
        text: 'Invalid invite code',
        type: 'error'
      }, 5))
    }

    if (response.toString().includes('Request failed with status code 400')) {
      return dispatch(createNotification({
        text: 'Username must be unique and password must be at least 3 characters',
        type: 'error'
      }, 5))
    }
  }

  return (
    <form onSubmit={handleSignup} style={{ marginTop: '15px' }}>
      <div>
        <TextField
          label="Username"
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUserName(target.value)}
        />
      </div>
      <div>
        <TextField
          label="Real name"
          id="realName"
          type="text"
          value={realName}
          name="Real name"
          onChange={({ target }) => setRealName(target.value)}
        />
      </div>
      <div>
        <TextField
          label="Password"
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <div>
        <TextField
          label="Invite code"
          id="inviteCode"
          type="text"
          value={invite}
          name="Invite code"
          onChange={({ target }) => setInvite(target.value)}
        />
      </div>
      <Button style={{ marginTop: '10px' }} variant="contained" color="primary" id="submitLogin" type="submit">register</Button>
    </form>
  )
}

export default RegisterForm