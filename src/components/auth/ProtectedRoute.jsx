import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import Loader from '@/components/Loader'

const ProtectedRoute = ({ children }) => {
  const { user, initialized } = useAppSelector((state) => state.auth)

  if (!initialized) return <Loader />
  if (!user) return <Navigate to='/login' replace />
  return children
}

export default ProtectedRoute
