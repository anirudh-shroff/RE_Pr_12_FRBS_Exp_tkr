import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { googleSignUp, login, resetPassword, signUp } from '@/features/auth/authSlice'
import { Spinner } from '../ui/spinner'

export const AuthForm = ({ type = 'login' }) => {
  const { isLoading } = useAppSelector((state) => state.auth)

  const title =
    type === 'signup' ? 'Create Account'
    : type === 'forgot' ? 'Reset Password'
    : 'Welcome Back'

  const subtitle =
    type === 'signup' ? 'Enter your details to create an account'
    : type === 'forgot' ? 'Enter your email to receive a reset link'
    : 'Enter your credentials to continue'

  const defaultFormData = { name: '', email: '', password: '', cpassword: '' }

  const dispatch = useAppDispatch()
  const [userData, setUserData] = useState(defaultFormData)
  const [errors, setErrors] = useState(defaultFormData)

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const { name, email, password, cpassword } = userData

  const handleErrors = () => {
    const errorList = { name: '', email: '', password: '', cpassword: '' }
    if (!name.trim() && type === 'signup') errorList.name = 'Please enter a valid name'
    if (!email.trim()) errorList.email = 'Please enter a valid email'
    if (!password.trim() && (type === 'login' || type === 'signup'))
      errorList.password = 'Password is required'
    if ((!cpassword.trim() || cpassword !== password) && type === 'signup')
      errorList.cpassword = 'Passwords do not match'
    setErrors(errorList)
    return Object.values(errorList).every((v) => v === '')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (handleErrors()) {
      switch (type) {
        case 'signup':
          dispatch(signUp({ email, password, name }))
          break
        case 'login':
          dispatch(login({ email, password }))
          break
        case 'forgot':
          dispatch(resetPassword(email))
          break
        default:
          return
      }
    }
  }

  return (
    <Card className='w-full max-w-sm'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-center'>{title}</CardTitle>
        <p className='text-center text-sm text-muted-foreground'>{subtitle}</p>
      </CardHeader>
      <CardContent>
        <form className='space-y-4' onSubmit={handleSubmit}>
          {type === 'signup' && (
            <div className='space-y-1'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                autoComplete='name'
                name='name'
                value={name}
                onChange={handleChange}
                placeholder='John Doe'
              />
              {errors.name && <p className='text-sm text-destructive'>{errors.name}</p>}
            </div>
          )}
          <div className='space-y-1'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              autoComplete='email'
              name='email'
              type='email'
              value={email}
              onChange={handleChange}
              placeholder='email@example.com'
            />
            {errors.email && <p className='text-sm text-destructive'>{errors.email}</p>}
          </div>
          {type !== 'forgot' && (
            <div className='space-y-1'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                autoComplete='new-password'
                name='password'
                type='password'
                value={password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className='text-sm text-destructive'>{errors.password}</p>
              )}
            </div>
          )}
          {type === 'signup' && (
            <div className='space-y-1'>
              <Label htmlFor='cpassword'>Confirm Password</Label>
              <Input
                id='cpassword'
                autoComplete='new-password'
                name='cpassword'
                type='password'
                value={cpassword}
                onChange={handleChange}
              />
              {errors.cpassword && (
                <p className='text-sm text-destructive'>{errors.cpassword}</p>
              )}
            </div>
          )}
          {type === 'login' && (
            <div className='text-right'>
              <Link
                to='/forgot-password'
                className='text-sm underline text-muted-foreground'
              >
                Forgot password?
              </Link>
            </div>
          )}
          <Button type='submit' className='w-full'>
            {type === 'signup' ? 'Sign Up' : type === 'forgot' ? 'Send reset link' : 'Login'}{' '}
            {isLoading && <Spinner />}
          </Button>
          {type !== 'forgot' && (
            <>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-background px-2 text-muted-foreground'>Or</span>
                </div>
              </div>
              <Button
                type='button'
                onClick={() => dispatch(googleSignUp())}
                variant='outline'
                className='w-full'
              >
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z' />
                </svg>{' '}
                Continue with Google
              </Button>
            </>
          )}
          <p className='text-center text-sm text-muted-foreground'>
            {type === 'signup' && (
              <>
                Already have an account?{' '}
                <Link to='/login' className='underline'>
                  Login
                </Link>
              </>
            )}
            {type === 'login' && (
              <>
                Don&apos;t have an account?{' '}
                <Link to='/signup' className='underline'>
                  Sign up
                </Link>
              </>
            )}
            {type === 'forgot' && (
              <>
                Remembered your password?{' '}
                <Link to='/login' className='underline'>
                  Back to login
                </Link>
              </>
            )}
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

export default AuthForm
