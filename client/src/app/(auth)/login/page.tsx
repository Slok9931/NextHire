"use client"
import React, { useState } from 'react'

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [btnLoading, setBtnLoading] = useState(false)

  return (
    <div>
      <h1>Login Page</h1>
    </div>
  )
}

export default Login
