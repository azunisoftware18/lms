import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReduxProvider } from './providers/reduxProvider'
import { QueryProvider } from './providers/queryProvider'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ReduxProvider>
        <QueryProvider>
          <h1>Welcome to React</h1>
        </QueryProvider>
      </ReduxProvider>
    </BrowserRouter>
  </StrictMode>,
)
