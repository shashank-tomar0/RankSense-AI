import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const isPlaceholder = !PUBLISHABLE_KEY || PUBLISHABLE_KEY.includes('YOUR_PUBLISHABLE_KEY')

function MissingKeyOverlay() {
  return (
    <div style={{
      height: '100vh', background: '#05080f', color: '#00f5ff',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Orbitron, sans-serif', textAlign: 'center', padding: 20
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: 20, textShadow: '0 0 20px #00f5ff' }}>CLERK SETUP REQUIRED</h1>
      <div style={{
        padding: '30px', border: '1px solid #00f5ff', background: 'rgba(0,245,255,0.05)',
        maxWidth: '500px', lineHeight: '1.6', fontFamily: 'Share Tech Mono, monospace'
      }}>
        <p>Your <strong>VITE_CLERK_PUBLISHABLE_KEY</strong> is not set.</p>
        <ol style={{ textAlign: 'left', marginTop: 20, display: 'inline-block' }}>
          <li>Go to <strong>dashboard.clerk.com</strong></li>
          <li>Copy your <strong>Publishable Key</strong></li>
          <li>Paste it into <strong>client/.env</strong></li>
        </ol>
        <p style={{ marginTop: 20, color: '#ff2d78' }}>App will resume automatically once key is added.</p>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isPlaceholder ? (
      <MissingKeyOverlay />
    ) : (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    )}
  </StrictMode>,
)
