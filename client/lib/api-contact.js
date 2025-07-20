const listByUser = async (signal) => {
  try {
    const jwtData = sessionStorage.getItem('jwt')
    if (!jwtData) {
      return { error: 'No authentication token found' }
    }
    
    const jwt = JSON.parse(jwtData)
    const token = jwt.token
    
    if (!token) {
      return { error: 'Invalid authentication token' }
    }
    
    let response = await fetch('/api/contacts/user', {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        return { error: 'Authentication failed. Please log in again.' }
      }
      return { error: `Server error: ${response.status}` }
    }
    
    return await response.json()
  } catch(err) {
    if (err.name === 'AbortError') {
      return { error: 'Request cancelled' }
    }
    console.log(err)
    return { error: err.message }
  }
}

const create = async (contact) => {
  try {
    const jwtData = sessionStorage.getItem('jwt')
    if (!jwtData) {
      return { error: 'No authentication token found' }
    }
    
    const jwt = JSON.parse(jwtData)
    const token = jwt.token
    
    let response = await fetch('/api/contacts/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(contact)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return { error: errorData.error || `Server error: ${response.status}` }
    }
    
    return await response.json()
  } catch(err) {
    console.log(err)
    return { error: err.message }
  }
}

const update = async (contactId, contact) => {
  try {
    const jwtData = sessionStorage.getItem('jwt')
    if (!jwtData) {
      return { error: 'No authentication token found' }
    }
    
    const jwt = JSON.parse(jwtData)
    const token = jwt.token
    
    let response = await fetch(`/api/contacts/${contactId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(contact)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return { error: errorData.error || `Server error: ${response.status}` }
    }
    
    return await response.json()
  } catch(err) {
    console.log(err)
    return { error: err.message }
  }
}

const remove = async (contactId) => {
  try {
    const jwtData = sessionStorage.getItem('jwt')
    if (!jwtData) {
      return { error: 'No authentication token found' }
    }
    
    const jwt = JSON.parse(jwtData)
    const token = jwt.token
    
    let response = await fetch(`/api/contacts/${contactId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return { error: errorData.error || `Server error: ${response.status}` }
    }
    
    return await response.json()
  } catch(err) {
    console.log(err)
    return { error: err.message }
  }
}

const list = async (signal) => {
  try {
    let response = await fetch('/api/contacts/', {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    return await response.json()
  } catch(err) {
    console.log(err)
    return { error: err.message }
  }
}

export { list, listByUser, create, update, remove }
