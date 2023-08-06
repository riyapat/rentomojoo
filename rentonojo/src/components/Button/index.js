
import React from 'react'

const Button = ({
    label = '',
    className = '',
    onClick = () => console.log('Button clicked'),
    type = 'button',
    icon = '',
    disabled = false
}) => {
  return (
    <button type={type} className={`flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${className}`} onClick={onClick} disabled={disabled}>
      { icon && <span className={`${label && 'mr-2'}`}>{icon}</span> }
      { label && <span>{label}</span> }
    </button>
  )
}

export default Button