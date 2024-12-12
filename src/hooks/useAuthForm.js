import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function useAuthForm(authFunction, successRedirect = '/') {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setLoading(true)
      const { error } = await authFunction({ email, password })
      if (error) throw error
      navigate(successRedirect)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit
  }
} 