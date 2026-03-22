import { Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase/firebase.config'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { setUser, clearUser } from './features/auth/authSlice'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Header from './components/Header'
import Loader from './components/Loader'
import HomePage from './pages/layout/HomePage'
import Dashboard from './pages/layout/Dashboard'
import SignUp from './pages/auth/SignUp'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
import { Toaster } from './components/ui/sonner'
import ExpensesPage from './pages/expenses/ExpensesPage'
import CategoriesPage from './pages/categories/CategoriesPage'
import { clearCategories } from './features/categories/categorySlice'
import { clearExpenses } from './features/expenses/expenseSlice'

const App = () => {
  const dispatch = useAppDispatch()
  const { initialized } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          })
        )
      } else {
        dispatch(clearUser())
        dispatch(clearCategories())
        dispatch(clearExpenses())
      }
    })
    return unsub
  }, [dispatch])

  if (!initialized) {
    return <Loader />
  }

  return (
    <div className='container max-w-7xl mx-auto px-8 pb-4'>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/expenses'
          element={
            <ProtectedRoute>
              <ExpensesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/categories'
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
      </Routes>
      <Toaster position='top-center' duration={1000} />
    </div>
  )
}

export default App
