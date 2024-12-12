import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ConfirmEmail from './pages/ConfirmEmail'
import AddRecipe from './pages/AddRecipe'
import RecipeDetails from './pages/RecipeDetails'
import Profile from './pages/Profile'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={
              <div className="container-padding">
                <Login />
              </div>
            } />
            <Route path="/register" element={
              <div className="container-padding">
                <Register />
              </div>
            } />
            <Route path="/confirm-email" element={
              <div className="container-padding">
                <ConfirmEmail />
              </div>
            } />
            <Route 
              path="/add-recipe" 
              element={
                <PrivateRoute>
                  <AddRecipe />
                </PrivateRoute>
              } 
            />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  )
}

export default App
