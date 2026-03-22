import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { AuthForm } from '@/components/auth/AuthForm'

const Login = () => {
  const navigate = useNavigate()
  const { user, initialized } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (initialized && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, initialized, navigate])

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <AuthForm type='login' />
    </div>
  )
}

export default Login
