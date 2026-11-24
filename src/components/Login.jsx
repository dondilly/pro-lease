import { useEffect, useState } from 'react'
import { authenticate, loginError } from '../auth.js'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, Eye, EyeOff, KeyRound, LoaderCircle, UserRound } from 'lucide-react'
import './Login.css'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    document.body.classList.remove('app')
    document.body.classList.add('login-active')

    return () => {
      document.body.classList.remove('login-active')
      document.body.classList.add('app')
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const succeeded = await authenticate(username, password)
      if (succeeded) {
        onLogin()
      } else {
        setError(loginError)
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to sign in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="shadcn-login-screen">

     

      <Card className="login-card">
        <CardHeader className="login-card-header">
          <div className="login-brand-mark">
            <Building2 aria-hidden="true" />
          </div>
          <div className="login-heading">
            <CardTitle className="login-card-title">Welcome back</CardTitle>
            <CardDescription className="login-card-description">
              Sign in to manage your properties and leases.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="login-card-content">

           {error && (
              <Alert className="login-error-alert" variant="destructive">
                <AlertDescription className="login-error-text">{error}</AlertDescription>
              </Alert>
          )}
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <Label className="login-label" htmlFor="username">Username</Label>
              <div className="login-input-wrap">
                <UserRound className="login-field-icon" aria-hidden="true" />
                <Input
                  id="username"
                  className="login-input login-input--with-icon"
                  type="text"
                  name="username"
                  placeholder="Your username"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <Label className="login-label" htmlFor="password">Password</Label>
              <div className="login-input-wrap">
                <KeyRound className="login-field-icon" aria-hidden="true" />
                <Input
                  id="password"
                  className="login-input login-input--with-icon login-input--with-toggle"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="login-password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword
                    ? <EyeOff className="size-4" aria-hidden="true" />
                    : <Eye className="size-4" aria-hidden="true" />}
                </Button>
              </div>
            </div>

            

            <Button className="login-submit-button" type="submit" disabled={isSubmitting}>
              {isSubmitting && <LoaderCircle className="login-spinner" aria-hidden="true" />}
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="login-footer">
            Secure access to your Pro Lease workspace
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

export default Login
