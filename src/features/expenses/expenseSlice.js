import { db } from '@/config/firebase/firebase.config'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { toast } from 'sonner'

const initialState = {
  expenseList: [],
  isLoading: false,
}

export const addExpense = createAsyncThunk(
  'expense/addExpense',
  async ({ name, category, amount, date, createdAt, createdBy }, { rejectWithValue }) => {
    try {
      const expense = { name, category, amount, date, createdAt, createdBy }
      const docRef = await addDoc(collection(db, 'expenses'), expense)
      toast.success('Expense added successfully')
      return { expenseId: docRef.id, ...expense }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchExpensesByUser = createAsyncThunk(
  'expense/fetchExpensesByUser',
  async (uid, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, 'expenses'),
        where('createdBy', '==', uid),
        orderBy('date', 'asc')
      )
      const snap = await getDocs(q)
      const expenses = snap.docs.map((doc) => ({
        expenseId: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toString(),
      }))
      return expenses
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const updateExpense = createAsyncThunk(
  'expense/updateExpense',
  async ({ expenseId, name, category, amount, date }, { rejectWithValue }) => {
    try {
      await updateDoc(doc(db, 'expenses', expenseId), { name, category, amount, date })
      toast.success('Expense updated successfully')
      return { expenseId, name, amount, category, date }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const deleteExpense = createAsyncThunk(
  'expense/deleteExpense',
  async (expenseId, { rejectWithValue }) => {
    if (!expenseId) return
    try {
      await deleteDoc(doc(db, 'expenses', expenseId))
      toast.success('Expense successfully deleted')
      return expenseId
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    clearExpenses: (state) => {
      state.expenseList = []
      state.isLoading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpensesByUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchExpensesByUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.expenseList = action.payload
      })
      .addCase(fetchExpensesByUser.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.expenseList.push(action.payload)
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenseList = state.expenseList.filter(
          (expense) => expense.expenseId !== action.payload
        )
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const { expenseId, name, category, amount, date } = action.payload
        const index = state.expenseList.findIndex((exp) => exp.expenseId === expenseId)
        if (index !== -1) {
          state.expenseList[index] = {
            ...state.expenseList[index],
            name,
            category,
            amount,
            date,
          }
        }
      })
  },
})

export const { clearExpenses } = expenseSlice.actions
export default expenseSlice.reducer