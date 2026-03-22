import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import categoryReducer from '@/features/categories/categorySlice'
import expenseReducer from '@/features/expenses/expenseSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    expense: expenseReducer,
  },
})
