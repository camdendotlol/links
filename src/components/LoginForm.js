import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { TextField, Button } from '@material-ui/core'
import { logInUser } from '../reducers/userReducer'
import { createNotification } from '../reducers/notificationReducer'
import { useHistory } from 'react-router-dom'

const LoginForm = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    const response = await dispatch(logInUser({
      'username': username,
      'password': password
    }))

    if (response.toString().includes('Request failed with status code 401')) {
      return dispatch(createNotification({
        text: 'Invalid credentials',
        type: 'error'
      }, 5))
    }

    // clear the notification so any login errors go away after successful login
    dispatch(createNotification({
      text: '',
      type: 'notification'
    }))
    history.goBack()
  }

  return (
    <form onSubmit={handleLogin}>
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
          label="Password"
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <Button style={{ marginTop: '10px' }} variant="contained" color="primary" id="submitLogin" type="submit">log in</Button>
    </form>
  )
}

export default LoginForm