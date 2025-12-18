"use client"
import { useAppData } from '@/context/AppContext'
import { redirect } from 'next/navigation'
import React, { useState } from 'react'

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [btnLoading, setBtnLoading] = useState(false)

    const { isAuth, setUser, loading, setIsAuth } = useAppData();
    
    if (isAuth) return redirect('/')
    
  return (
    <div>
      <h1>Login Page</h1>
    </div>
  )
}

export default Login
