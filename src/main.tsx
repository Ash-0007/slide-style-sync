import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'
import './index.css'
import { StatusProvider } from './contexts/StatusContext'
import { Toaster } from "@/components/ui/sonner"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StatusProvider>
      <App />
      <Toaster richColors closeButton />
    </StatusProvider>
  </React.StrictMode>,
)
