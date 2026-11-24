export let token = null
export let loginError = ''

export async function authenticate(username, password) {
  loginError = ''

  const response = await fetch('http://localhost:8080/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  if (response.status !== 200) {
    const responseText = await response.text()
    let message = responseText || `Sign in failed (HTTP ${response.status}).`

    if (responseText) {
      try {
        const data = JSON.parse(responseText)
        if (data && typeof data === 'object') {
          if (typeof data.error === 'string') {
            message = data.error
          } else if (typeof data.message === 'string') {
            message = data.message
          }
        }
      } catch {
        message = responseText
      }
    }

    loginError = message
    token = null
    return false
  }

  const data = await response.json()
  if (!data || typeof data.access_token !== 'string' || !data.access_token.trim()) {
    loginError = 'The server response did not include a valid token.'
    token = null
    return false
  }

  token = data.access_token
  return true
}
