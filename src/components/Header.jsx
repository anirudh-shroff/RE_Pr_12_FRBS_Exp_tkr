import { Link, NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Button } from './ui/button'
import { logout } from '@/features/auth/authSlice'
import { BadgeIndianRupee, LogOut, Menu } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

const navLinkClass = ({ isActive }) =>
  isActive
    ? 'text-foreground border-b-2 border-primary pb-1 text-sm font-medium'
    : 'text-muted-foreground hover:text-foreground text-sm font-medium'

const mobileNavLinkClass = ({ isActive }) =>
  isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'

const Header = () => {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  return (
    <header className='w-full border-b bg-background'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4'>
        <Link to='/' className='flex items-center gap-2 text-2xl'>
          <BadgeIndianRupee size={32} />
        </Link>
        <div className='flex items-center gap-4'>
          <nav className='hidden md:flex items-center gap-6'>
            <NavLink to='/' className={navLinkClass}>Home</NavLink>
            <NavLink to='/dashboard' className={navLinkClass}>Dashboard</NavLink>
            <NavLink to='/expenses' className={navLinkClass}>Expenses</NavLink>
            <NavLink to='/categories' className={navLinkClass}>Categories</NavLink>
          </nav>
          <div className='md:hidden'>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <Menu className='h-5 w-5' />
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-72'>
                <SheetHeader className='flex items-center flex-row'>
                  <SheetTitle className='flex items-center gap-2 text-xl'>
                    <BadgeIndianRupee size={24} />
                    ExpenseTracker
                  </SheetTitle>
                </SheetHeader>
                <div className='mt-6 flex flex-col gap-4 px-2'>
                  {user && (
                    <div className='text-sm'>
                      <p className='text-muted-foreground'>Signed in as</p>
                      <p className='font-medium break-all'>{user.displayName ?? user.email}</p>
                    </div>
                  )}
                  <Separator />
                  <nav className='flex flex-col gap-3 text-sm'>
                    <NavLink to='/' className={mobileNavLinkClass}>Home</NavLink>
                    <NavLink to='/dashboard' className={mobileNavLinkClass}>Dashboard</NavLink>
                    <NavLink to='/expenses' className={mobileNavLinkClass}>Expenses</NavLink>
                    <NavLink to='/categories' className={mobileNavLinkClass}>Categories</NavLink>
                  </nav>
                  <Separator />
                  {user && (
                    <Button
                      variant='destructive'
                      className='mt-2'
                      onClick={() => dispatch(logout())}
                    >
                      <LogOut className='mr-2 h-4 w-4' />
                      Log out
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        {user && (
          <div className='hidden md:block'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='px-2'>
                  {user.displayName ?? user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem
                  onClick={() => dispatch(logout())}
                  className='cursor-pointer text-destructive focus:text-destructive'
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
