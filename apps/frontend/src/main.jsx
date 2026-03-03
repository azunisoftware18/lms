import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReduxProvider } from './providers/reduxProvider'
import { QueryProvider } from './providers/queryProvider'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ReduxProvider>
        <QueryProvider>
          <AppRoutes />
        </QueryProvider>
      </ReduxProvider>
    </BrowserRouter>
  </StrictMode>,
)
