import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function useRedirectAuth(redirectUrl = '/') {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate(redirectUrl)
    }
  }, [user, navigate, redirectUrl])
} 