import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, LogOut, Plus, Save, Trash2 } from 'lucide-react'
import { adminRequest, uploadAdminAsset } from './services/api'
import './Admin.css'

const resourceFields = {
  stores: ['name', 'category', 'description', 'floor', 'location', 'color'],
  floors: ['name', 'number', 'description'],
  events: ['title', 'description', 'startDate', 'endDate', 'location', 'floor', 'status'],
  offers: ['title', 'description', 'store', 'startDate', 'endDate', 'status'],
  services: ['name', 'description', 'category', 'location', 'floor', 'active'],
  mall: ['name', 'address', 'description', 'contactEmail', 'contactPhone'],
  enquiries: [],
  newsletter: ['email'],
}

function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem('orion-admin-token') || '')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [resource, setResource] = useState('stores')
  const [records, setRecords] = useState([])
  const [editor, setEditor] = useState(null)
  const [jsonText, setJsonText] = useState('{}')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [uploadedAsset, setUploadedAsset] = useState('')
  const [uploading, setUploading] = useState(false)

  const loadRecords = async (activeToken = token, selectedResource = resource) => {
    try {
      const result = await adminRequest(selectedResource, { token: activeToken })
      setRecords(Array.isArray(result) ? result : result ? [result] : [])
    } catch (requestError) {
      setError(requestError.message)
      setRecords([])
    }
  }

  useEffect(() => {
    if (!token) return undefined
    let active = true
    adminRequest(resource, { token }).then((result) => {
      if (active) setRecords(Array.isArray(result) ? result : result ? [result] : [])
    }).catch((requestError) => {
      if (active) {
        setError(requestError.message)
        setRecords([])
      }
    })
    return () => { active = false }
  }, [token, resource])

  const signIn = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const result = await adminRequest('login', { method: 'POST', body: { email, password } })
      sessionStorage.setItem('orion-admin-token', result.token)
      setToken(result.token)
      setPassword('')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const signOut = () => {
    sessionStorage.removeItem('orion-admin-token')
    setToken('')
    setRecords([])
  }

  const openEditor = (record = {}) => {
    const editable = { ...record }
    delete editable._id
    delete editable.__v
    setEditor(record._id || 'new')
    setJsonText(JSON.stringify(editable, null, 2))
    setUploadedAsset('')
    setStatus('')
    setError('')
  }

  const handleUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const input = event.currentTarget
    let record
    try {
      record = JSON.parse(jsonText)
    } catch {
      setError('Fix the record JSON before uploading an asset.')
      input.value = ''
      return
    }
    setError('')
    setStatus('')
    setUploading(true)
    try {
      const url = await uploadAdminAsset(file, token)
      setUploadedAsset(url)
      if (file.name.toLowerCase().endsWith('.glb')) record.storefront = { ...(record.storefront || {}), modelUrl: url }
      else record.images = [...(Array.isArray(record.images) ? record.images : []), url]
      setJsonText(JSON.stringify(record, null, 2))
      setStatus('Asset uploaded and added to this record. Save the record to keep the change.')
    } catch (uploadError) {
      setError(uploadError.message)
    } finally {
      setUploading(false)
      input.value = ''
    }
  }

  const saveRecord = async (event) => {
    event.preventDefault()
    let body
    try {
      body = JSON.parse(jsonText)
    } catch {
      setError('Enter valid JSON before saving.')
      return
    }
    try {
      await adminRequest(editor === 'new' ? resource : `${resource}/${editor}`, {
        token, method: editor === 'new' ? 'POST' : 'PUT', body,
      })
      setEditor(null)
      setStatus('Changes saved.')
      await loadRecords()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const deleteRecord = async (record) => {
    if (!window.confirm(`Delete "${record.name || record.title || 'this record'}"? This cannot be undone.`)) return
    try {
      await adminRequest(`${resource}/${record._id}`, { token, method: 'DELETE' })
      setStatus('Record deleted.')
      await loadRecords()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  if (!token) return (
    <main className="admin-login-shell">
      <Link to="/" className="admin-back"><ArrowLeft size={17} /> Back to Orion</Link>
      <form className="admin-login" onSubmit={signIn}>
        <p className="eyebrow">ORION MALL · ADMINISTRATION</p>
        <h1>Welcome back.</h1>
        <p>Sign in with the administrator account configured on the server.</p>
        <label>Email address<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <button className="button button-dark" type="submit">Sign in</button>
        {error && <p className="admin-error" role="alert">{error}</p>}
      </form>
    </main>
  )

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div><p className="eyebrow">ORION MALL · CONTENT</p><h1>Admin workspace</h1></div>
        <button className="admin-logout" onClick={signOut}><LogOut size={16} /> Sign out</button>
      </header>
      <div className="admin-body">
        <aside className="admin-sidebar">
          <Link to="/" className="admin-back"><ArrowLeft size={16} /> View website</Link>
          <p className="eyebrow">MANAGE CONTENT</p>
          {Object.keys(resourceFields).map((name) => <button key={name} className={resource === name ? 'admin-nav-item active' : 'admin-nav-item'} onClick={() => { setError(''); setStatus(''); setResource(name); setEditor(null) }}>{name}</button>)}
        </aside>
        <section className="admin-content">
          <div className="admin-content-title"><div><p className="eyebrow">DATABASE COLLECTION</p><h2>{resource}</h2></div>
            {resource !== 'enquiries' && <button className="button button-dark" onClick={() => openEditor()}><Plus size={16} /> Add {resource === 'mall' ? 'information' : resource === 'newsletter' ? 'subscription' : resource.slice(0, -1)}</button>}
          </div>
          {status && <p className="admin-success" role="status">{status}</p>}
          {error && <p className="admin-error" role="alert">{error}</p>}
          {editor !== null && <form className="admin-editor" onSubmit={saveRecord}>
            <div className="admin-content-title"><h3>{editor === 'new' ? 'Create record' : 'Edit record'}</h3><span>JSON · fields: {resourceFields[resource].join(', ') || 'read only'}</span></div>
            {['stores', 'events', 'offers'].includes(resource) && <label className="admin-upload">Upload image or GLB model<input type="file" disabled={uploading} accept="image/jpeg,image/png,image/webp,model/gltf-binary,.glb" onChange={handleUpload} /></label>}
            {uploadedAsset && <p className="uploaded-asset">Asset URL <code>{uploadedAsset}</code></p>}
            <textarea spellCheck="false" aria-label="Record JSON" disabled={uploading} value={jsonText} onChange={(event) => setJsonText(event.target.value)} />
            <div className="admin-editor-actions"><button className="button button-dark" type="submit"><Save size={16} /> Save changes</button><button type="button" className="button button-light" onClick={() => setEditor(null)}>Cancel</button></div>
          </form>}
          <div className="admin-record-list">
            {records.map((record) => <article className="admin-record" key={record._id || JSON.stringify(record)}>
              <div><h3>{record.name || record.title || record.email || 'Mall information'}</h3><p>{record.category || record.location || record.description || record.message || record.address || '—'}</p></div>
              {resource !== 'enquiries' && <div className="admin-record-actions"><button onClick={() => openEditor(record)} aria-label="Edit record"><Save size={16} /></button><button onClick={() => deleteRecord(record)} aria-label="Delete record"><Trash2 size={16} /></button></div>}
            </article>)}
            {!records.length && <p className="admin-empty">No records found. Add your first {resource === 'mall' ? 'mall profile' : resource.slice(0, -1)} or check the database connection.</p>}
          </div>
        </section>
      </div>
    </main>
  )
}

export default AdminPage
