import { useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import AddCategoryDialog from '@/components/AddCategoryDialog'
import { fetchCategoriesByUser } from '@/features/categories/categorySlice'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Spinner } from '@/components/ui/spinner'
import DeleteCategoryDialog from '@/components/DeleteCategoryDialog'

const CategoriesPage = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { categoryList, isLoading } = useAppSelector((state) => state.category)

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchCategoriesByUser(user.uid))
    }
  }, [user?.uid, dispatch])

  return !isLoading ? (
    <div className='space-y-6 mt-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Categories</h1>
        <AddCategoryDialog />
      </div>
      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryList.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className='text-center text-muted-foreground'>
                  No categories found
                </TableCell>
              </TableRow>
            )}
            {categoryList.map((category) => (
              <TableRow key={category.categoryId}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.date}</TableCell>
                <TableCell className='text-right space-x-2'>
                  <AddCategoryDialog category={category} />
                  <DeleteCategoryDialog
                    categoryId={category.categoryId}
                    categoryName={category.name}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  ) : (
    <Spinner className='mx-auto mt-12 h-10 w-10' />
  )
}

export default CategoriesPage
