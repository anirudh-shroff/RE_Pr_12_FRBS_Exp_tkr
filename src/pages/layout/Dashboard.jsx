import { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts'
import { IndianRupee, Receipt, FolderKanban } from 'lucide-react'
import { fetchCategoriesByUser } from '@/features/categories/categorySlice'
import { fetchExpensesByUser } from '@/features/expenses/expenseSlice'

const Dashboard = () => {
  const { expenseList } = useAppSelector((state) => state.expense)
  const { categoryList } = useAppSelector((state) => state.category)
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchCategoriesByUser(user?.uid))
    dispatch(fetchExpensesByUser(user?.uid))
  }, [dispatch, user?.uid])

  const totalExpense = useMemo(
    () => expenseList.reduce((sum, exp) => sum + exp.amount, 0),
    [expenseList]
  )

  const expenseByCategory = useMemo(() => {
    const map = new Map()
    expenseList.forEach((exp) => {
      const prev = map.get(exp.category) ?? 0
      map.set(exp.category, prev + exp.amount)
    })
    return Array.from(map.entries()).map(([categoryId, total]) => ({
      category:
        categoryList.find((cat) => cat.categoryId === categoryId)?.name ?? 'Unknown',
      total,
    }))
  }, [expenseList, categoryList])

  const monthlyExpenses = useMemo(() => {
    const map = new Map()
    expenseList.forEach((exp) => {
      const d = new Date(exp.date)
      const key = d.toLocaleString('default', { month: 'short', year: 'numeric' })
      const prev = map.get(key) ?? 0
      map.set(key, prev + exp.amount)
    })
    return Array.from(map.entries()).map(([month, total]) => ({ month, total }))
  }, [expenseList])

  return (
    <div className='space-y-6 mt-6'>
      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-sm font-medium'>Total Expenses</CardTitle>
            <IndianRupee className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='text-2xl font-semibold'>
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
            }).format(totalExpense)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-sm font-medium'>Transactions</CardTitle>
            <Receipt className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='text-2xl font-semibold'>{expenseList.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-sm font-medium'>Categories</CardTitle>
            <FolderKanban className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent className='text-2xl font-semibold'>{categoryList.length}</CardContent>
        </Card>
      </div>
      <div className='grid gap-4 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[260px] w-full'>
              <ChartContainer config={{ total: { label: 'Amount' } }}>
                <BarChart data={expenseByCategory}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey='category' tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey='total' radius={6} fill='var(--chart-custom)' />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[260px] w-full'>
              <ChartContainer config={{ total: { label: 'Amount' } }}>
                <AreaChart data={monthlyExpenses}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey='month' tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type='monotone' dataKey='total' strokeWidth={2} fillOpacity={0.2} />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
