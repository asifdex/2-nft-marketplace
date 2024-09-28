import React from 'react'

const Input = ({ placeholder, name, type, value, handleChange }:InputProps) => {

  return (
    <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    required
    value={value}
    onChange={ (e)=>handleChange(e,name!)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-white border text-sm white-glassmorphism"
  />
  )
}

export default Input
