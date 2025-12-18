"use client"

import React, { useState } from 'react'

const Register = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [btnLoading, setBtnLoading] = useState(false)

  return (
    <div>
      <h1>Register Page</h1>
    </div>
  )
}

export default Register
