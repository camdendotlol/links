import React, { useState, useImperativeHandle } from 'react'
import { Button } from '@material-ui/core'

const Toggleable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '', float: 'right', marginBottom: '10px' }
  const showWhenVisible = { display: visible ? '' : 'none', textAlign: 'center', marginBottom: '10px' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div className="newNoteForm">
      <div style={hideWhenVisible}>
        <Button variant="contained" color="primary" id={props.buttonId} onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button variant="contained" color="secondary" className="toggleable" onClick={toggleVisibility}>cancel</Button>
      </div>
    </div>
  )
})

Toggleable.displayName = 'Togglable'

export default Toggleable