import { Loader2 } from 'lucide-react'

const Loader = () => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-background'>
      <Loader2 className='h-8 w-8 animate-spin text-gray-800 dark:text-gray-100' />
    </div>
  )
}

export default Loader
