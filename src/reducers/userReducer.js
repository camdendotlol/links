import login from '../services/login'
import blogService from '../services/blogs'

export const initializeUser = () => {
  return async dispatch => {
    const userToken = await window.localStorage.getItem('loggedBlogListUser')
    dispatch({
      type: 'INIT_USER',
      data: userToken
    })
  }
}

export const logInUser = userObject => {
  return async dispatch => {
    try {
      const user = await login.login(userObject)
      await window.localStorage.setItem('loggedBlogListUser', JSON.stringify(user))
      dispatch({
        type: 'LOGIN',
        data: user
      })
      return 1
    } catch(error) {
      return error
    }
  }
}

export const logOutUser = () => {
  return async dispatch => {
    await window.localStorage.removeItem('loggedBlogListUser')
    dispatch({
      type: 'LOGOUT'
    })
  }
}

export const registerUser = userObject => {
  return async dispatch => {
    try{
      const user = await login.register(userObject)
      await window.localStorage.setItem('loggedBlogListUser', JSON.stringify(user))
      dispatch({
        type: 'REGISTER',
        data: user
      })
      return 1
    } catch(error) {
      return error
    }
  }
}

const userReducer = (state = [], action) => {
  switch(action.type) {
  case 'INIT_USER':
    if (!action.data) {
      return null
    } else {
      const user = JSON.parse(action.data)
      blogService.setToken(user.token)
      return user
    }
  case 'LOGIN':
    if (!action.data) {
      return state
    } else {
      const user = action.data
      blogService.setToken(user.token)
      return action.data
    }
  case 'LOGOUT':
    return null
  case 'REGISTER':
    if (!action.data) {
      return state
    } else {
      const user = action.data
      blogService.setToken(user.token)
      return action.data
    }
  case 'LIKE': {
    const blog = action.data
    return { ...state, likes: state.likes.concat(blog.id.toString()) }
  }
  case 'UNLIKE': {
    const blog = action.data
    return { ...state, likes: state.likes.filter(like => like !== blog.id.toString()) }
  }
  default:
    return state
  }
}

export default userReducer