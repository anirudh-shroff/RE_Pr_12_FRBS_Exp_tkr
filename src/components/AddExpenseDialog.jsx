import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, Pencil } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { addExpense, updateExpense } from '@/features/expenses/expenseSlice'

const AddExpenseDialog = ({ expense }) => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { categoryList } = useAppSelector((state) => state.category)
  const isEditMode = Boolean(expense)

  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')

  const hasCategories = categoryList.length > 0

  useEffect(() => {
    if (!open) return
    if (expense) {
      setName(expense.name)
      setCategoryId(expense.category)
      setAmount(String(expense.amount))
      setDate(expense.date)
    } else {
      setName('')
      setCategoryId('')
      setAmount('')
      setDate('')
    }
  }, [expense, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!hasCategories) return
    if (isEditMode && expense?.expenseId) {
      dispatch(
        updateExpense({
          expenseId: expense.expenseId,
          name,
          category: categoryId,
          amount: Number(amount),
          date,
          createdAt: expense.createdAt,
        })
      )
    } else {
      dispatch(
        addExpense({
          name,
          category: categoryId,
          amount: Number(amount),
          date,
          createdAt: new Date(),
          createdBy: user?.uid,
        })
      )
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button variant='outline' size='icon'>
            <Pencil className='h-4 w-4' />
          </Button>
        ) : (
          <Button>Add Expense</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        </DialogHeader>
        {!hasCategories && (
          <p className='text-sm text-muted-foreground'>
            You must add at least one category before creating expenses.
          </p>
        )}
        <form className='space-y-4' onSubmit={handleSubmit}>
          <Input
            placeholder='Expense name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!hasCategories}
          />
          <Select value={categoryId} onValueChange={setCategoryId} disabled={!hasCategories}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select category' />
            </SelectTrigger>
            <SelectContent>
              {categoryList.map((cat) => (
                <SelectItem key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type='number'
            placeholder='Amount'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={!hasCategories}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='w-full justify-start text-left font-normal border-2 border-input hover:border-primary'
                disabled={!hasCategories}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {date ? format(new Date(date), 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={date ? new Date(date) : undefined}
                onSelect={(selected) =>
                  setDate(selected ? format(selected, 'yyyy-MM-dd') : '')
                }
              />
            </PopoverContent>
          </Popover>
          <Button className='w-full' disabled={!hasCategories}>
            {isEditMode ? 'Update Expense' : 'Save Expense'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddExpenseDialog
