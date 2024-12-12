import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes'
import Layout from './layouts/Layout'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <AppRoutes />
        </Layout>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#4CAF50',
              },
            },
            error: {
              duration: 4000,
              theme: {
                primary: '#E53E3E',
              },
            },
          }}
        />
      </AuthProvider>
    </Router>
  )
}

export default App
