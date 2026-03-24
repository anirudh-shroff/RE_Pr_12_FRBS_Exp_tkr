import { useMemo, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ArrowDown, ArrowDownUp, ArrowUp, Trash2 } from 'lucide-react'
import AddExpenseDialog from '@/components/AddExpenseDialog'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { deleteExpense } from '@/features/expenses/expenseSlice'

const ExpensesPage = () => {
  const dispatch = useAppDispatch()
  const { expenseList, isLoading } = useAppSelector((state) => state.expense)
  const { categoryList } = useAppSelector((state) => state.category)
  const [sortKey, setSortKey] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const sortedExpenses = useMemo(() => {
    return [...expenseList].sort((a, b) => {
      if (sortKey === 'amount') {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount
      }
      return sortOrder === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }, [expenseList, sortKey, sortOrder])

  const totalAmount = useMemo(
    () => expenseList.reduce((sum, exp) => sum + exp.amount, 0),
    [expenseList]
  )

  const getCategoryName = (categoryId) =>
    categoryList.find((cat) => cat.categoryId === categoryId)?.name ?? '—'

  const sortIndicator = (key) => {
    if (sortKey !== key) return <ArrowDownUp size={12} />
    return sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
  }

  return (
    <div className='space-y-6 mt-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Expenses</h1>
        <AddExpenseDialog />
      </div>
      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead
                title='Sort by amount'
                onClick={() => handleSort('amount')}
                className='cursor-pointer select-none hover:bg-muted/50 transition'
              >
                <p className='flex items-center'>
                  Amount <span className='ml-1 text-xs'>{sortIndicator('amount')}</span>
                </p>
              </TableHead>
              <TableHead
                title='Sort by date'
                onClick={() => handleSort('date')}
                className='cursor-pointer select-none hover:bg-muted/50 transition'
              >
                <p className='flex items-center'>
                  Date <span className='ml-1 text-xs'>{sortIndicator('date')}</span>
                </p>
              </TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className='text-center text-muted-foreground'>
                  Loading expenses...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && sortedExpenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className='text-center text-muted-foreground'>
                  No expenses found
                </TableCell>
              </TableRow>
            )}
            {!isLoading && sortedExpenses.map((expense) => (
              <TableRow key={expense.expenseId}>
                <TableCell className='font-medium'>{expense.name}</TableCell>
                <TableCell className='text-muted-foreground'>
                  {getCategoryName(expense.category)}
                </TableCell>
                <TableCell className='font-semibold'>₹ {expense.amount}</TableCell>
                <TableCell>{expense.date}</TableCell>
                <TableCell className='text-right space-x-2'>
                  <AddExpenseDialog expense={expense} />
                  <Button
                    variant='destructive'
                    size='icon'
                    onClick={() => dispatch(deleteExpense(expense.expenseId))}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && expenseList.length > 0 && (
              <TableRow>
                <TableCell colSpan={2} className='font-semibold'>
                  Total
                </TableCell>
                <TableCell className='font-semibold'>₹ {totalAmount}</TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ExpensesPage