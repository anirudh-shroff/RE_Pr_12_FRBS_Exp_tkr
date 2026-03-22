import { Link, NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wallet, BarChart3, ShieldCheck } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useEffect } from 'react'
import { fetchCategoriesByUser } from '@/features/categories/categorySlice'
import { fetchExpensesByUser } from '@/features/expenses/expenseSlice'

const AuthLink = () => {
  const { user, initialized } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchCategoriesByUser(user?.uid))
    dispatch(fetchExpensesByUser(user?.uid))
  }, [dispatch, user?.uid])

  if (!initialized) return null

  return user ? (
    <Button asChild size='lg'>
      <NavLink to='/dashboard'>Go to Dashboard</NavLink>
    </Button>
  ) : (
    <div className='flex gap-4'>
      <Button asChild size='lg' variant='outline'>
        <NavLink to='/login'>Login</NavLink>
      </Button>
      <Button asChild size='lg'>
        <NavLink to='/signup'>Sign Up</NavLink>
      </Button>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className='min-h-screen bg-background'>
      <section className='container mx-auto px-4 py-14 text-center'>
        <Badge variant='secondary' className='mb-4'>
          Simple • Secure • Fast
        </Badge>
        <h1 className='text-4xl md:text-5xl font-bold tracking-tight'>
          Track your expenses with clarity
        </h1>
        <p className='mt-4 text-muted-foreground max-w-2xl mx-auto'>
          A modern expense tracker to monitor spending, analyze trends, and stay in control of
          your finances.
        </p>
        <div className='mt-8 flex justify-center gap-4'>
          <AuthLink />
        </div>
      </section>
      <section className='container mx-auto px-4 py-10 grid gap-6 md:grid-cols-3'>
        <Card className='rounded-2xl'>
          <CardHeader>
            <Wallet className='h-8 w-8 text-muted-foreground' />
            <CardTitle className='mt-4'>Smart Expense Tracking</CardTitle>
          </CardHeader>
          <CardContent className='text-muted-foreground'>
            Log daily expenses, categorize spending, and keep everything organized effortlessly.
          </CardContent>
        </Card>
        <Card className='rounded-2xl'>
          <CardHeader>
            <BarChart3 className='h-8 w-8 text-muted-foreground' />
            <CardTitle className='mt-4'>Visual Insights</CardTitle>
          </CardHeader>
          <CardContent className='text-muted-foreground'>
            Interactive charts and summaries help you understand where your money goes.
          </CardContent>
        </Card>
        <Card className='rounded-2xl'>
          <CardHeader>
            <ShieldCheck className='h-8 w-8 text-muted-foreground' />
            <CardTitle className='mt-4'>Secure by Default</CardTitle>
          </CardHeader>
          <CardContent className='text-muted-foreground'>
            Your data is protected with modern authentication and secure storage practices.
          </CardContent>
        </Card>
      </section>
      <section className='container mx-auto px-4 py-14 text-center'>
        <Card className='max-w-3xl mx-auto rounded-2xl'>
          <CardContent className='py-12'>
            <h2 className='text-3xl font-semibold'>Start managing your money today</h2>
            <p className='mt-4 text-muted-foreground'>
              Sign up in seconds and take control of your personal finances.
            </p>
            <Button asChild size='lg' className='mt-6'>
              <Link to='/signup'>Create Free Account</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
