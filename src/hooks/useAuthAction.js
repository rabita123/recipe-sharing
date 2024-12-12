import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function useAuthAction() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleAuthAction = async (action, redirectUrl = '/login') => {
    if (!user) {
      navigate(redirectUrl, { 
        state: { from: window.location.pathname }
      })
      return false
    }

    try {
      setLoading(true)
      setError('')
      await action()
      return true
    } catch (error) {
      setError(error.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    handleAuthAction,
    loading,
    error,
    setError
  }
} 