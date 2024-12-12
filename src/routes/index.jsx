import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ConfirmEmail from '../pages/ConfirmEmail'
import AddRecipe from '../pages/AddRecipe'
import RecipeDetails from '../pages/RecipeDetails'
import Profile from '../pages/Profile'
import PrivateRoute from '../components/PrivateRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route 
        path="/login" 
        element={
          <div className="page-container">
            <Login />
          </div>
        } 
      />
      
      <Route 
        path="/register" 
        element={
          <div className="page-container">
            <Register />
          </div>
        } 
      />
      
      <Route 
        path="/confirm-email" 
        element={
          <div className="page-container">
            <ConfirmEmail />
          </div>
        } 
      />
      
      <Route 
        path="/add-recipe" 
        element={
          <PrivateRoute>
            <AddRecipe />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/recipe/:id" 
        element={<RecipeDetails />} 
      />
      
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default AppRoutes 