import { AuthForm } from '@/components/auth/AuthForm'

const ForgotPassword = () => {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <AuthForm type='forgot' />
    </div>
  )
}

export default ForgotPassword
