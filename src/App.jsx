import { useState } from 'react'
import Dashboard from './Dashboard.jsx'
import Login from './components/Login.jsx'

function App() {
  const [authenticated, setAuthenticated] = useState(false)

  return authenticated
    ? <Dashboard />
    : <Login onLogin={() => setAuthenticated(true)} />
}

export default App
