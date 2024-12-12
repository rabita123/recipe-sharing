import { useRequireAuth } from '../hooks/useRequireAuth'

function PrivateRoute({ children }) {
  const user = useRequireAuth()
  return user ? children : null
}

export default PrivateRoute 