import listUsers from '../services/login'

export const getAllUsers = () => {
  return async dispatch => {
    const users = await listUsers.listUsers()
    dispatch({
      type: 'LIST_USERS',
      data: users
    })
  }
}

const userInfoReducer = (state = [], action) => {
  switch (action.type) {
  case 'LIST_USERS':
    return action.data
  default:
    return state
  }
}

export default userInfoReducer