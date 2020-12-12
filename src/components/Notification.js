import React from 'react'
import { useSelector } from 'react-redux'

import { Alert } from '@material-ui/lab'

const Notification = () => {
  const notificationObject = useSelector(state => state.notification)
  const notificationType = notificationObject.type
  const notificationText = notificationObject.text

  if (!notificationText) {
    return null
  }

  if (notificationType === 'notification') {
    return (
      <Alert severity="success">
        {notificationText}
      </Alert>
    )
  }

  return (
    <Alert severity="error">
      {notificationText}
    </Alert>
  )
}

export default Notification