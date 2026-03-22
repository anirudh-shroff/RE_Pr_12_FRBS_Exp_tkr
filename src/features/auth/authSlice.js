import { auth, db, provider } from '@/config/firebase/firebase.config'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FirebaseError } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { toast } from 'sonner'

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  initialized: false,
}

const getErrorMsg = (errCode) => {
  switch (errCode) {
    case 'auth/invalid-credential':
      return 'Invalid email or password'
    case 'auth/too-many-requests':
      return 'Too many requests. Wait a few minutes before trying again.'
    case 'auth/invalid-email':
      return 'Invalid Email'
    default:
      return 'Something went wrong'
  }
}

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      if (name) {
        await updateProfile(user, { displayName: name })
      }
      toast.success('Account created successfully')
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
        createdAt: new Date(),
      })
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      }
    } catch (err) {
      if (err instanceof FirebaseError) {
        toast.error(getErrorMsg(err.code))
        return rejectWithValue({ code: err.code, message: err.message })
      }
      return rejectWithValue({ code: 'unknown', message: 'Something went wrong' })
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      toast.success('Logged in successfully')
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      }
    } catch (err) {
      if (err instanceof FirebaseError) {
        toast.error(getErrorMsg(err.code))
        return rejectWithValue({ code: err.code, message: err.message })
      }
      return rejectWithValue({ code: 'unknown', message: 'Something went wrong' })
    }
  }
)

export const googleSignUp = createAsyncThunk(
  'auth/googleSignUp',
  async (_, { rejectWithValue }) => {
    try {
      const { user } = await signInWithPopup(auth, provider)
      const snap = await getDoc(doc(db, 'users', user.uid))
      if (!snap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date(),
        })
      }
      toast.success('Logged in successfully')
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      }
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await signOut(auth)
    toast.success('Logged out successfully')
  } catch (err) {
    if (err instanceof FirebaseError) {
      toast.error(getErrorMsg(err.code))
      return rejectWithValue({ code: err.code, message: err.message })
    }
    return rejectWithValue({ code: 'unknown', message: 'Something went wrong' })
  }
})

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email, { rejectWithValue }) => {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email))
      const snap = await getDocs(q)
      if (snap.empty) {
        toast.error('No account exists with this email')
        throw new Error('No account found')
      }
      await sendPasswordResetEmail(auth, email)
      toast.success('Password reset link sent to your email.')
      return null
    } catch (err) {
      if (err instanceof FirebaseError) {
        toast.error(getErrorMsg(err.code))
        return rejectWithValue({ code: err.code, message: err.message })
      }
      return rejectWithValue({ code: 'unknown', message: 'Something went wrong' })
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload
      state.initialized = true
    },
    clearUser(state) {
      state.user = null
      state.initialized = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(googleSignUp.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { setUser, clearUser } = authSlice.actions
export default authSlice.reducer
