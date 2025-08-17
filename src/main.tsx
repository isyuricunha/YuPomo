import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'

// Mark document when running under Tauri for desktop-specific styling/behavior
if (typeof window !== 'undefined' && '__TAURI_IPC__' in window) {
  document.documentElement.classList.add('tauri')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
