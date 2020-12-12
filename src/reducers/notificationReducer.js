const notificationReducer = (state = '', action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return {
      text: action.notification.text,
      type: action.notification.type
    }
  case 'CLEAR_NOTIFICATION':
    return { text: '', ...action.notification }
  default:
    return state
  }
}

let timer

export const createNotification = (notificationObject, seconds) => {
  if (timer){
    clearTimeout(timer)
  }

  return dispatch => {
    timer = setTimeout(() => {
      dispatch({
        type: 'CLEAR_NOTIFICATION'
      })
    }, seconds * 1000)

    dispatch({
      type: 'SET_NOTIFICATION',
      notification: {
        text: notificationObject.text,
        type: notificationObject.type
      }
    })
  }
}

export default notificationReducer