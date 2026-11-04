const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function fetchCollection(resource, signal) {
  const response = await fetch(`${API_BASE}/${resource}`, { signal })
  if (!response.ok) throw new Error(`Could not load ${resource} (${response.status}).`)
  const result = await response.json()
  return result.data ?? result
}

export async function submitEnquiry(payload) {
  const response = await fetch(`${API_BASE}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.message || 'Your message could not be sent.')
  return result
}

export async function submitNewsletter(payload) {
  const response = await fetch(`${API_BASE}/newsletter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.message || 'Your subscription could not be completed.')
  return result
}

export async function adminRequest(path, { token, method = 'GET', body } = {}) {
  const response = await fetch(`${API_BASE}/admin/${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.message || `Request failed (${response.status}).`)
  return result.data ?? result
}

export async function uploadAdminAsset(file, token) {
  const form = new FormData()
  form.append('file', file)
  const response = await fetch(`${API_BASE}/admin/uploads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.message || `Upload failed (${response.status}).`)
  return result.data.url
}
