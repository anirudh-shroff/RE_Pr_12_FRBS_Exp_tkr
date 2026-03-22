import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { AuthForm } from '@/components/auth/AuthForm'

const SignUp = () => {
  const navigate = useNavigate()
  const { user, initialized } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (initialized && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [initialized, user, navigate])

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <AuthForm type='signup' />
    </div>
  )
}

export default SignUp
