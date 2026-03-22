import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { addCategory, updateCategory } from '@/features/categories/categorySlice'
import { Pencil } from 'lucide-react'

const CategoryDialog = ({ category }) => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    if (category) {
      setName(category.name)
    }
  }, [category])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    if (category) {
      dispatch(updateCategory({ categoryId: category.categoryId, name }))
    } else {
      dispatch(
        addCategory({
          name,
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date(),
          createdBy: user?.uid,
        })
      )
    }
    setOpen(false)
    setName('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={category ? 'outline' : 'default'}>
          {category ? <Pencil /> : 'Add Category'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
        </DialogHeader>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <div className='space-y-2'>
            <Label htmlFor='name'>Category Name</Label>
            <Input
              placeholder='e.g. Food'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Button className='w-full' type='submit'>
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryDialog
