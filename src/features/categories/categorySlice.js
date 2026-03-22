import { db } from '@/config/firebase/firebase.config'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { toast } from 'sonner'

const initialState = {
  categoryList: [],
  isLoading: false,
}

export const addCategory = createAsyncThunk(
  'category/addCategory',
  async ({ name, createdAt, createdBy, date }, { rejectWithValue }) => {
    const category = { name, date, createdAt, createdBy }
    try {
      const docRef = await addDoc(collection(db, 'categories'), category)
      toast.success('Category added successfully')
      return { categoryId: docRef.id, ...category }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchCategoriesByUser = createAsyncThunk(
  'category/fetchCategoriesByUser',
  async (uid, { rejectWithValue }) => {
    try {
      const q = query(collection(db, 'categories'), where('createdBy', '==', uid))
      const snap = await getDocs(q)
      const categories = snap.docs.map((doc) => ({
        categoryId: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toString(),
      }))
      return categories
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ categoryId, name }, { rejectWithValue }) => {
    try {
      await updateDoc(doc(db, 'categories', categoryId), { name })
      toast.success('Category updated successfully')
      return { categoryId, name }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const q = query(collection(db, 'expenses'), where('category', '==', categoryId))
      const snap = await getDocs(q)
      const deletions = snap.docs.map((docSnap) =>
        deleteDoc(doc(db, 'expenses', docSnap.id))
      )
      await Promise.all(deletions)
      await deleteDoc(doc(db, 'categories', categoryId))
      toast.success('Category and related expenses deleted')
      return categoryId
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearCategories: (state) => {
      state.categoryList = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categoryList.push(action.payload)
      })
      .addCase(fetchCategoriesByUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCategoriesByUser.fulfilled, (state, action) => {
        state.categoryList = action.payload
        state.isLoading = false
      })
      .addCase(fetchCategoriesByUser.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categoryList = state.categoryList.filter(
          (cat) => cat.categoryId !== action.payload
        )
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const category = state.categoryList.find(
          (cat) => cat.categoryId === action.payload.categoryId
        )
        if (category) {
          category.name = action.payload.name
        }
      })
  },
})

export const { clearCategories } = categorySlice.actions
export default categorySlice.reducer
