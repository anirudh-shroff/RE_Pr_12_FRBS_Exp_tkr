import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { store } from './app/store/store.js'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'next-themes'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider attribute='class' defaultTheme='system'>
        <App />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>
)
